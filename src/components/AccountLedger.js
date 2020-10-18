import React, { useState, useEffect, useReducer } from 'react';
import { instanceOf, func } from 'prop-types';
import { Checkbox } from 'semantic-ui-react';
import CellEdit from './CellEdit';
import { searchLines } from '../reducers/search';
import { open, saveAs, save, readData } from '../reducers/csv';
import { computeTotals } from '../reducers/computations';
import { linesReducer, linesInitialState } from '../reducers/lines.reducer';
import { scrollToBottom, scrollTo } from '../reducers/scroll';
import Message from './Message';
import Search from './Search';
import FileButtons from './FileButtons';

// Livre des recettes
const AccountLedger = ({ parameters, fileChange }) => {
  // Column metadata definition
  const storedCurrentFile = localStorage.getItem('accountLedger');
  const [currentFile, setCurrentFile] = useState(undefined);
  const [{
    selectedLines,
    highlightedLines,
    lines,
    cols,
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

  const lineChange = (lineNumber, col, val) => {
    dispatchLinesAction({ type: 'lineChange', lineNumber, col, val });
  };

  const addLine = () => {
    dispatchLinesAction({ type: 'addLine' });
    setTimeout(() => scrollToBottom('#ledger-scrollable-container'), 200);
  };

  const computedTotals = computeTotals(lines, cols);
  const totals = cols.map(col => {
    let total = computedTotals.get(col.id);
    total = total ? `${total}€` : '';
    return (<th key={`total-${col.id}`}>{total}</th>);
  });

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

  // Return error message to display if any for given line / column
  const getErrorMsg = (lineNumber, errorLines, col) => {
    const error = errorLines.filter(err => err.lineNumber === lineNumber);
    if (error.length === 0) {
      return null;
    }
    if (error[0].cols.some(errorCol => col.id === errorCol.id)) {
      return (<i className="icon attention" title="Obligatoire" />);
    }
    return '';
  };

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

  const thead = cols.map(col => (
    <th
      key={`header-cell-${col.id}`}
      onClick={() => handleSort(col.id)}
      className={sortState.column === col.id ? `sorted ${sortState.direction}` : 'sorted'}
    >
      {col.title}
    </th>
  ));

  const tbody = lines.map((line, lineNumber) => {
    const td = cols.map(col => {
      const key = `body-cell-${lineNumber}-${col.id}`;
      const errorMsg = getErrorMsg(lineNumber, errors, col);
      return (
        <td key={key} id={key} className={errorMsg ? 'error' : ''}>
          <CellEdit
            def={col}
            value={line[col.id]}
            onChange={val => lineChange(lineNumber, col, val)}
          />
          {errorMsg || ''}
        </td>
      );
    });
    return (
      <tr
        key={`body-line-${lineNumber}`}
        className={highlightedLines.includes(lineNumber) ? 'positive' : ''}
      >
        <td key={`body-check-${lineNumber}`}>
          <Checkbox
            checked={selectedLines.some(selectedLine => selectedLine === lineNumber)}
            onChange={(e, { checked }) => select(lineNumber, checked)}
          />
        </td>
        {td}
      </tr>
    );
  });

  return (
    <article>
      <section className="buttons-bar border-bottom">
        <FileButtons
          onOpen={() => {
            open(currentFile, setCurrentFile, fileChange, setActionMessage, lines, cols)
              .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }));
          }}
          onSave={() => checkErrors()
            .then(() => save(currentFile, lines, cols, setActionMessage))
            .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
          }
          onSaveAs={() => checkErrors()
            .then(() => saveAs(currentFile, setCurrentFile, fileChange, lines, cols, setActionMessage))
            .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
          }
        />
        {actionMessage && <Message type={actionMessage.type} message={actionMessage.message} />}
        <Search
          cols={cols}
          onChange={() => setSearchResults([])}
          onSearchClick={(text, option) => search(text, option)}
        />
      </section>
      <section id="ledger-scrollable-container" style={{ height: '75vh', overflow: 'auto' }}>
        <table className="ui table small compact brown sortable">
          <thead>
            <tr>
              <th key="header-check">
                <Checkbox
                  checked={selectedLines.length > 0 && selectedLines.length === lines.length}
                  onChange={(_e, { checked }) => selectAll(checked)}
                />
              </th>
              {thead}
            </tr>
          </thead>
          <tbody>
            {tbody}
          </tbody>
          <tfoot>
            <tr>
              <th>&nbsp;</th>
              {totals}
            </tr>
          </tfoot>
        </table>
      </section>
      <section className="buttons-bar border-top">
        <div>
          <button type="button" className="ui icon button primary" onClick={addLine}>
            <i aria-hidden="true" className="plus icon" />
            {' '}
            Nouvelle ligne
          </button>
          <button
            type="button"
            disabled={selectedLines.length === 0}
            className="ui icon button red"
            onClick={removeLines}
          >
            <i aria-hidden="true" className="trash icon" />
            {' '}
            Supprimer les lignes
          </button>
          <button
            type="button"
            disabled={selectedLines.length === 0}
            className="ui icon button secondary"
            onClick={duplicateLines}
          >
            <i aria-hidden="true" className="copy icon" />
            {' '}
            Dupliquer les lignes
          </button>
        </div>
      </section>
    </article>
  );
};

AccountLedger.propTypes = {
  parameters: instanceOf(Map).isRequired,
  fileChange: func.isRequired,
};

export default AccountLedger;
