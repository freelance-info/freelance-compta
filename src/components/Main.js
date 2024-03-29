import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { instanceOf, func } from 'prop-types';
import { searchLines } from '../utils/search';
import { open, saveAs, save, readData } from '../utils/csv';
import { linesReducer, linesInitialState } from '../reducers/lines.reducer';
import { scrollToBottom, scrollTo } from '../utils/scroll';
import Message from './Message';
import Search from './Search';
import FileButtons from './FileButtons';
import { BottomButtons } from './BottomButtons';
import { Table } from './Table';
import { VAT } from './VAT';
import { computeRowCellId } from '../utils/computations';
import { SCROLLABLE_ELEMENT_ID } from '../utils/globals';
import { LinesContext } from '../contexts/lines.context';

// Account Ledger ("Livre des recettes" in french)
const Main = ({ parameters, fileChange }) => {
  const [actionMessage, setActionMessage] = useState(undefined);

  // COLUMN DEFINITION
  const storedCurrentFile = localStorage.getItem('accountLedger');
  const [currentFile, setCurrentFile] = useState(undefined);
  const [showVat, setShowVat] = useState(false);
  const [{
    selectedLines,
    highlightedLines,
    lines,
    cols,
    unsaved,
  }, dispatchLinesAction] = useReducer(linesReducer, linesInitialState);
  const linesContextValue = useMemo(() => ([{
    selectedLines,
    highlightedLines,
    lines,
    cols,
    unsaved,
  }, dispatchLinesAction]), [selectedLines, highlightedLines, lines, cols, unsaved, dispatchLinesAction]);

  const vat = () => {
    setShowVat(true);
  };

  useEffect(() => {
    dispatchLinesAction({ type: 'initCols', parameters });
  }, [parameters]);

  // FILES
  useEffect(() => {
    if (!currentFile) {
      if (storedCurrentFile) {
        setCurrentFile(() => storedCurrentFile);
        fileChange(storedCurrentFile);
      }
    } else {
      if (currentFile !== storedCurrentFile) {
        localStorage.setItem('accountLedger', currentFile);
      }
      readData(currentFile, cols)
        .then(initLines => {
          dispatchLinesAction({ type: 'initLines', initLines });
        })
        .catch(error => {
          const message = `Problème avec le fichier "${currentFile}": ${error.message}`;
          setActionMessage({ type: 'negative', message });
        });
    }
  }, [currentFile]);

  const addLine = () => {
    dispatchLinesAction({ type: 'addLine' });
    setTimeout(() => scrollToBottom(`#${SCROLLABLE_ELEMENT_ID}`), 200);
  };

  // ERRORS
  const [lineErrors, setLineErrors] = useState([]);

  // Return error object if any for given line
  const validateLine = (line, lineNumber, columns) => ({
    lineNumber,
    cols: columns.filter(col => col.required && !line[col.id]),
  });

  // Write values to current file
  const checkErrors = (theLines, theCols) => new Promise((resolve, reject) => {
    // Check error on every existing lines
    const errorLines = theLines.map((line, lineNumber) => validateLine(line, lineNumber, theCols))
      .filter(error => error.cols.length > 0);

    // Perform save action if no error
    if (errorLines.length === 0) {
      setLineErrors(() => []);
      setActionMessage(undefined);
      resolve();
    } else {
      setLineErrors(() => errorLines);
      const theColId = theCols.find(col => col.width !== '0').id;
      const colSelector = `#${computeRowCellId(errorLines[0].lineNumber, theColId)}`;
      setTimeout(() => scrollTo(`#${SCROLLABLE_ELEMENT_ID}`, colSelector), 200);
      reject(new Error('Enregistrement impossible, veuillez corriger les erreurs'));
    }
  });

  // SEARCH
  const [searchResults, setSearchResults] = useState(undefined);
  // Search the given col for text, then scroll to it
  const search = (searchText, searchColId) => {
    setSearchResults(searchLines(lines, searchText, searchColId, searchResults));
  };

  // FILES
  const onNew = () => {
    localStorage.removeItem('accountLedger');
    setCurrentFile(null);
    setActionMessage(null);
    fileChange(null);
    dispatchLinesAction({ type: 'initLines', initLines: [] });
  };
  const onOpen = () => {
    open(currentFile, setCurrentFile, fileChange, setActionMessage, lines, cols)
      .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
      .catch(err => setActionMessage({ type: 'negative', message: err.message ?? err }));
  };
  const onSaveAs = () => {
    checkErrors(lines, cols)
      .then(() => saveAs(currentFile, setCurrentFile, fileChange, lines, cols, setActionMessage))
      .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
      .then(() => dispatchLinesAction({ type: 'saved' }))
      .catch(err => setActionMessage({ type: 'negative', message: err.message ?? err }));
  };
  const onSave = () => {
    if (currentFile) {
      checkErrors(lines, cols)
        .then(() => save(currentFile, lines, cols, setActionMessage))
        .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
        .then(() => dispatchLinesAction({ type: 'saved' }))
        .catch(err => setActionMessage({ type: 'negative', message: err.message ?? err }));
    } else {
      // If this is the 1st time app is launched, there is no currentFile: run saveAs
      onSaveAs();
    }
  };

  return (
    <LinesContext.Provider value={linesContextValue}>
      <article>

        <section className="buttons-bar border-bottom">
          <FileButtons hasUnsavedChanges={unsaved} onNew={onNew} onOpen={onOpen} onSave={onSave} onSaveAs={onSaveAs} />
          {actionMessage && <Message type={actionMessage.type} message={actionMessage.message} />}
          <Search cols={cols} onChange={() => setSearchResults([])} onSearchClick={search} />
        </section>

        <section id={SCROLLABLE_ELEMENT_ID} style={{ height: '75vh', overflow: 'auto' }}>
          <Table
            key="account-ledger-table"
            allSelected={selectedLines.length > 0 && selectedLines.length === lines.length}
            errors={lineErrors}
          />
        </section>

        <section className="buttons-bar border-top">
          <BottomButtons addLine={addLine} vat={vat} />
        </section>

        {
          showVat && <VAT open={showVat} setOpen={setShowVat} cols={cols} lines={lines} />
        }
      </article>
    </LinesContext.Provider>
  );
};

Main.propTypes = {
  parameters: instanceOf(Map).isRequired,
  fileChange: func.isRequired,
};

export default Main;
