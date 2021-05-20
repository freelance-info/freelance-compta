import React, { useState, useEffect, useReducer } from 'react';
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

// Account Ledger ("Livre des recettes" in french)
const Main = ({ parameters, fileChange }) => {
  // Column metadata definition
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

  /** ****** SELECTED LINES ACTIONS  */
  const selectAll = checked => {
    if (checked) {
      dispatchLinesAction({ type: 'selectAll' });
    } else {
      dispatchLinesAction({ type: 'unselectAll' });
    }
  };

  const select = (lineNumber, checked) => {
    dispatchLinesAction({ type: 'select', checked, lineNumber });
  };

  const removeLines = () => {
    dispatchLinesAction({ type: 'removeSelected' });
  };

  const duplicateLines = () => {
    dispatchLinesAction({ type: 'duplicateSelected' });
  };

  const vat = () => {
    setShowVat(true);
  };
  /** ******************* */

  useEffect(() => {
    dispatchLinesAction({ type: 'initCols', parameters });
  }, [parameters]);

  // Read data from file
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
      readData(currentFile, cols).then(initLines => {
        dispatchLinesAction({ type: 'initLines', initLines });
      });
    }
  }, [currentFile]);

  const rowChange = (lineNumber, col, val) => {
    dispatchLinesAction({ type: 'lineChange', lineNumber, col, val });
  };

  const addLine = () => {
    dispatchLinesAction({ type: 'addLine' });
    setTimeout(() => scrollToBottom('#ledger-scrollable-container'), 200);
  };

  /** ******  SORT ********* */
  const [sortState, setSortState] = useState({ column: 'date', direction: 'ascending' });
  const handleSort = clickedColumn => {
    const { column, direction } = sortState;
    const newDirection = column === clickedColumn && direction === 'ascending' ? 'descending' : 'ascending';
    setSortState({ column: clickedColumn, direction: newDirection });
    dispatchLinesAction({ type: 'sortLines', clickedColumn, direction: newDirection });
  };

  /** ******* ERRORS **** */
  const [errors, setErrors] = useState([]);
  const [actionMessage, setActionMessage] = useState(undefined);

  // Return error object if any for given line
  const validateLine = (line, lineNumber, columns) => ({
    lineNumber,
    cols: columns.filter(col => col.required && !line[col.id]),
  });

  // Write values to current file
  const checkErrors = () => new Promise((resolve, reject) => {
    // Check error on every existing lines
    const errorLines = lines.map((line, lineNumber) => validateLine(line, lineNumber, cols))
      .filter(error => error.cols.length > 0);

    // Perform save action if no error
    if (errorLines.length === 0) {
      setErrors(() => []);
      setActionMessage(undefined);
      resolve();
    } else {
      setErrors(() => errorLines);
      setActionMessage({ type: 'negative', message: 'Enregistrement impossible, veuillez corriger les erreurs' });
      setTimeout(() => scrollTo('#ledger-scrollable-container', `#body-cell-${errorLines[0].lineNumber}-${cols[0].id}`),
        200);
      reject();
    }
  });

  /** ****** SEARCH ********* */
  const [searchResults, setSearchResults] = useState(undefined);

  // Search the given col for text, then scroll to it
  const search = (searchText, searchColId) => {
    setSearchResults(searchLines(lines, searchText, searchColId, searchResults));
  };
  /** *************** */

  /** ********* FILES *************** */
  const onNew = () => {
    localStorage.removeItem('accountLedger');
    setCurrentFile(null);
    fileChange(null);
    dispatchLinesAction({ type: 'initLines', initLines: [] });
  };

  const onOpen = () => {
    open(currentFile, setCurrentFile, fileChange, setActionMessage, lines, cols)
      .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }));
  };

  const onSaveAs = () => checkErrors()
    .then(() => saveAs(currentFile, setCurrentFile, fileChange, lines, cols, setActionMessage))
    .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
    .then(() => dispatchLinesAction({ type: 'saved' }));

  const onSave = () => {
    if (currentFile) {
      checkErrors()
        .then(() => save(currentFile, lines, cols, setActionMessage))
        .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
        .then(() => dispatchLinesAction({ type: 'saved' }));
    } else {
      // If this is the 1st time app is launched, there is no currentFile: run saveAs
      onSaveAs();
    }
  };

  return (
    <article>
      <section className="buttons-bar border-bottom">
        <FileButtons hasUnsavedChanges={unsaved} onNew={onNew} onOpen={onOpen} onSave={onSave} onSaveAs={onSaveAs} />
        {actionMessage && <Message type={actionMessage.type} message={actionMessage.message} />}
        <Search cols={cols} onChange={() => setSearchResults([])} onSearchClick={search} />
      </section>
      <section id="ledger-scrollable-container" style={{ height: '75vh', overflow: 'auto' }}>
        <Table
          key="account-ledger-table"
          cols={cols}
          lines={lines}
          rowChange={rowChange}
          selectedLines={selectedLines}
          select={select}
          allSelected={selectedLines.length > 0 && selectedLines.length === lines.length}
          selectAll={selectAll}
          highlightedLines={highlightedLines}
          sort={sortState}
          onSort={handleSort}
          errors={errors}
        />
      </section>
      <section className="buttons-bar border-top">
        <BottomButtons
          hasSelectedLines={selectedLines.length > 0}
          addLine={addLine}
          removeLines={removeLines}
          duplicateLines={duplicateLines}
          vat={vat}
        />
      </section>
      <VAT open={showVat} setOpen={setShowVat} cols={cols} lines={lines} />
    </article>
  );
};

Main.propTypes = {
  parameters: instanceOf(Map).isRequired,
  fileChange: func.isRequired,
};

export default Main;
