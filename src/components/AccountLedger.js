import React, { useState, useEffect } from 'react';
import { instanceOf, func } from 'prop-types';
import { Checkbox } from 'semantic-ui-react';
import CellEdit from './CellEdit';
import {
  open, saveAs, save, readData,
} from '../helpers/csv';
import { parseDate } from '../helpers/date';
import { sortByCol } from '../helpers/sort';
import { computeTotals } from '../helpers/computations';
import {
  OPTIONS_CASHING, OPTIONS_TVA, PARAMETER_DEFAULT_CASHING, PARAMETER_DEFAULT_TVA,
} from '../helpers/globals';
import { scrollToBottom, scrollTo } from '../helpers/scroll';
import Message from './Message';
import Search from './Search';
import FileButtons from './FileButtons';

// Livre des recettes
const AccountLedger = ({ parameters, fileChange }) => {
  // Column metadata definition
  const [cols, setCols] = useState([
    {
      id: 'date', title: 'Date', type: 'Date', required: true,
    },
    {
      id: 'ref', title: 'Réf. de la facture', type: 'Text', required: false, width: '75px',
    },
    {
      id: 'client', title: 'Client', type: 'Text', required: false, width: '150px',
    },
    {
      id: 'nature', title: 'Nature', type: 'Text', required: true, width: '200px',
    },
    {
      id: 'ht', title: 'Montant HT', type: 'Number', required: false, width: '100px',
    },
    {
      id: 'ttc', title: 'Montant TTC', type: 'Number', required: true, width: '100px',
    },
    {
      id: 'tva', title: 'TVA', type: 'Select', required: false, width: '75px', options: OPTIONS_TVA,
    },
    {
      id: 'mode',
      title: "Mode d'encaissement",
      type: 'Select',
      required: false,
      width: '100px',
      options: OPTIONS_CASHING,
    },
  ]);
  const [lines, setLines] = useState([]);
  const storedCurrentFile = localStorage.getItem('accountLedger');
  const [currentFile, setCurrentFile] = useState(undefined);
  const [selectedLines, setSelectedLines] = useState([]);
  const [highlightedLines, setHighlightedLines] = useState([]);

  /** ****** SELECTED LINES ACTIONS  */
  const selectAll = checked => {
    setSelectedLines(() => (checked ? lines.map((_line, index) => index) : []));
  };

  const select = (lineNumber, checked) => {
    setSelectedLines(prevSelectedLines => {
      const newSelectedLines = [...prevSelectedLines];
      if (checked) {
        newSelectedLines.push(lineNumber);
      } else {
        const idx = newSelectedLines.findIndex(selectedLine => selectedLine === lineNumber);
        newSelectedLines.splice(idx, 1);
      }
      return newSelectedLines;
    });
  };

  const removeLines = () => {
    setLines(prevLines => {
      const newLines = [];
      prevLines.forEach((line, index) => {
        if (!selectedLines.some(idx => index === idx)) {
          newLines.push(line);
        }
      });
      setSelectedLines(() => []);
      return newLines;
    });
  };

  const duplicateLines = () => {
    const newHighlightedLines = [];
    setLines(prevLines => {
      const newLines = [...prevLines];
      prevLines.forEach((line, index) => {
        if (selectedLines.some(idx => index === idx)) {
          const newLine = { ...line };
          newLines.push(newLine);
          newHighlightedLines.push(newLines.length - 1);
        }
      });
      return newLines;
    });
    setHighlightedLines(prev => [...prev, ...newHighlightedLines]);
    setSelectedLines([]);
  };
  /** ******************* */

  useEffect(() => {
    setCols(prevCols => {
      // Set default values from parameters
      const newCols = [...prevCols];
      const tvaIndex = newCols.findIndex(prevCol => prevCol.id === 'tva');
      newCols[tvaIndex].defaultValue = parameters.get(PARAMETER_DEFAULT_TVA);
      const modeIndex = newCols.findIndex(prevCol => prevCol.id === 'mode');
      newCols[modeIndex].defaultValue = parameters.get(PARAMETER_DEFAULT_CASHING);
      return newCols;
    });
  }, [parameters]);

  // Read data from saved file
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
      readData(currentFile, cols).then(readLines => {
        setLines(() => sortByCol(readLines, 'date'));
        setHighlightedLines(() => []);
        setSelectedLines(() => []);
      });
    }
  }, [currentFile]);

  const lineChange = (lineNumber, col, val) => {
    setLines(prevLines => {
      const newLines = [...prevLines];
      newLines[lineNumber][col.id] = val;
      if (col.id === 'ht') {
        const tva = newLines[lineNumber].tva / 100;
        newLines[lineNumber].ttc = Math.round(val * (1 + tva) * 100) / 100;
      }
      return newLines;
    });
  };

  const addLine = () => {
    setLines(prevLines => {
      const newLines = [...prevLines];
      const newLine = {};
      cols.forEach(col => { newLine[col.id] = col.defaultValue; });
      newLines.push(newLine);
      setHighlightedLines(previousLines => [...previousLines, newLines.length - 1]);
      setSelectedLines([]);
      setTimeout(() => scrollToBottom('#ledger-scrollable-container'), 200);
      return newLines;
    });
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

    if (column !== clickedColumn) {
      setSortState({
        column: clickedColumn,
        direction: 'ascending',
      });
      setLines(prev => {
        const newLines = [...prev];
        newLines.sort((a, b) => a[clickedColumn] < b[clickedColumn]);
        return newLines;
      });
    } else {
      setSortState(() => ({
        column,
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      }));
      setLines(prev => {
        const newLines = [...prev];
        newLines.reverse();
        return newLines;
      });
    }
  };
  /** ******************* */

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
  const checkErrorsThen = fn => {
    // Check error on every existing lines
    const errorLines = lines.map((line, lineNumber) => validateLine(line, lineNumber, cols))
      .filter(error => error.cols.length > 0);

    // Perform save action if no error
    if (errorLines.length === 0) {
      setErrors(() => []);
      setActionMessage(undefined);
      fn();
    } else {
      setErrors(() => errorLines);
      setActionMessage({ type: 'negative', message: 'Enregistrement impossible, veuillez corriger les erreurs' });
      setTimeout(() => scrollTo('#ledger-scrollable-container', `#body-cell-${errorLines[0].lineNumber}-${cols[0].id}`),
        200);
    }
  };

  /** ******************* */

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

  /** ****** SEARCH ********* */
  const [searchResults, setSearchResults] = useState(undefined);

  // Search the given col for text, then scroll to it
  const search = (searchText, searchColId) => {
    let newSearchResults;
    let regexp = null;
    if (searchColId.toLowerCase() === 'date') {
      const normalizedDate = parseDate(searchText);
      if (normalizedDate) {
        const dateString = normalizedDate.toISOString().substr(0, 10);
        regexp = new RegExp(dateString);
      } else {
        return;
      }
    } else {
      regexp = new RegExp(searchText, 'gi');
    }
    if (searchResults.length === 0) {
      newSearchResults = [];
      lines.forEach((line, index) => {
        if (line[searchColId] && `${line[searchColId]}`.search(regexp) >= 0) {
          newSearchResults.push(index);
        }
      });
    }
    if (searchResults.length > 0) {
      newSearchResults = [...searchResults];
      const lineIndex = newSearchResults.shift();
      const cellId = `#body-cell-${lineIndex}-${searchColId}`;
      scrollTo('#ledger-scrollable-container', cellId);
      document.querySelectorAll('input').forEach(input => { input.style.backgroundColor = 'transparent'; });
      document.querySelector(cellId).querySelector('input').style.backgroundColor = 'yellow';
    }
    setSearchResults(newSearchResults);
  };
  /** *************** */

  return (
    <article>
      <section style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: '14px',
        borderBottom: '1px solid rgb(212, 212, 213)',
      }}
      >
        <FileButtons
          onOpen={() => open(currentFile, setCurrentFile, fileChange, setLines, setHighlightedLines, setSelectedLines, setActionMessage, cols)}
          onSave={() => checkErrorsThen(() => save(currentFile, setLines, setHighlightedLines, setSelectedLines, lines, cols, setActionMessage))}
          onSaveAs={() => checkErrorsThen(() => saveAs(currentFile, setCurrentFile, fileChange, setLines, setHighlightedLines, setSelectedLines, lines, cols, setActionMessage))}
        />
        {actionMessage && <Message {...actionMessage} />}
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
      <section style={{
        display: 'flex', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgb(212, 212, 213)',
      }}
      >
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
