import React, { useState, useEffect } from 'react';
import { Checkbox, Button, Select, Input } from 'semantic-ui-react';
import CellEdit from './CellEdit';
import { writeData, readData } from '../helpers/csv';
import { sortByCol } from '../helpers/sort';
import { computeTotals } from '../helpers/computations';
import { OPTIONS_CASHING, OPTIONS_TVA, PARAMETER_DEFAULT_CASHING, PARAMETER_DEFAULT_TVA } from '../helpers/globals';
import { scrollToBottom, scrollTo } from '../helpers/scroll';
const remote = window.require('electron').remote;

// Livre des recettes
export default function AccountLedger({parameters, fileChange}) {

    // Column metadata definition
    const [cols, setCols] = useState([
        { id: 'date', title: 'Date', type: 'Date', required: true },
        { id: 'ref', title: 'Réf. de la facture', type: 'Text', required: false, width: '75px' },
        { id: 'client', title: 'Client', type: 'Text', required: false, width: '150px' },
        { id: 'nature', title: 'Nature', type: 'Text', required: true, width: '200px' },
        { id: 'ht', title: 'Montant HT', type: 'Number', required: false, width: '100px' },
        { id: 'ttc', title: 'Montant TTC', type: 'Number', required: true, width: '100px' },
        { id: 'tva', title: 'TVA', type: 'Select', required: false, width: '75px', options: OPTIONS_TVA },
        { id: 'mode', title: "Mode d'encaissement", type: 'Select', required: false, width: '100px', options: OPTIONS_CASHING },
    ]);
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
    const [lines, setLines] = useState([]);
    const storedCurrentFile = localStorage.getItem('accountLedger');
    const [currentFile, setCurrentFile] = useState(undefined);
    useEffect(() => {
        if (!currentFile) {
            if (storedCurrentFile) {
                setCurrentFile(storedCurrentFile);
                fileChange(storedCurrentFile);
            }
        } else {
            if (currentFile !== storedCurrentFile) {
                localStorage.setItem('accountLedger', currentFile);
            }
            readData(currentFile, cols).then(readLines => setLines(sortByCol(readLines, 'date')));
        }
    }, [currentFile]);

    const [selectedLines, setSelectedLines] = useState([]);

    const [errors, setErrors] = useState([]);
    const [actionMessage, setActionMessage] = useState(undefined);
    
    const thead = cols.map((col, colNumber) => (<th key={`header-cell-${colNumber}`}>{ col.title }</th>));
    
    const tbody = lines.map((line, lineNumber) => {
        const td = cols.map(col => {
            const key = `body-cell-${lineNumber}-${col.id}`;
            const errorMsg = getErrorMsg(lineNumber, errors, col);
            return (
                <td key={key} id={key} className={errorMsg ? 'error' : ''}>
                    <CellEdit 
                        def={col}
                        value={ line[col.id] } 
                        onChange={ (val) => lineChange(setLines, lineNumber, col, val) }>
                    </CellEdit>
                    { errorMsg || '' }
                </td>)}
            );
        return (
            <tr key={`body-line-${lineNumber}`}>
                <td key={`body-check-${lineNumber}`}>
                    <Checkbox checked={ selectedLines.some(selectedLine => selectedLine === lineNumber) }
                        onChange={(e, { checked }) => select(setSelectedLines, lineNumber, checked) } />
                </td>
                { td }
            </tr>
        );
    });

    const actionMessageDiv = actionMessage ? (
        <div className={ 'ui message ' + actionMessage.type } style={{display : 'flex', margin: '0'}}>
            <i className={(actionMessage.type === 'positive' ? 'check circle outline' : 'times circle outline') + ' icon'}></i>
            <div className="content">
                <div className="header">{ actionMessage.message }</div>
            </div>
        </div>
    ) : undefined;

    const computedTotals = computeTotals(lines, cols);
    const totals = cols.map(col => {
        let total = computedTotals.get(col.id);
        total = total ? total + '€' : '';
        return (<th key={ `total-${col.id}` }>{ total }</th>)
    });

    const [searchOption, setSearchOption] = useState(cols[0].id);
    const [searchText, setSearchText] = useState(undefined);
    const [searchResults, setSearchResults] = useState(undefined);
    const searchOptions = cols.map(col => ({ key: col.id, text: col.title, value: col.id }));
    
    return (
    <article>
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '14px', borderBottom: '1px solid rgb(212, 212, 213)' }}>
            <div>               
                <button className="ui icon button green" 
                        onClick={() => open(currentFile, setCurrentFile, fileChange, setLines, cols)}
                        title="Ouvrir">
                    <i aria-hidden="true" className="folder open icon"></i>
                </button>
                <button className="ui icon button green"
                        onClick={() => checkErrorsThen(lines, cols, setErrors, setActionMessage, () => saveAs(currentFile, setCurrentFile, fileChange, setLines, lines, cols, setActionMessage))}
                        title="Enregistrer sous">
                    <i aria-hidden="true" className="copy icon"></i>
                </button>
                <button className="ui icon button green"
                        onClick={() => checkErrorsThen(lines, cols, setErrors, setActionMessage, () => save(currentFile, setLines, lines, cols, setActionMessage))}
                        title="Enregistrer">
                    <i aria-hidden="true" className="save icon"></i>
                </button>
            </div>
            { actionMessageDiv || '' }
            <Input type="text" placeholder="Rechercher..." action onChange={(e, { value} ) => { setSearchText(value); setSearchResults(undefined); } }>
                <input />
                <Select compact options={ searchOptions } defaultValue={ cols[0].id } onChange={(e, { value} ) => { setSearchOption(value); setSearchResults(undefined); } } />
                <Button onClick={ () => search(searchResults, setSearchResults, searchText, searchOption, lines) }><i aria-hidden="true" className="search icon"></i></Button>
            </Input>
        </section>
        <section id="ledger-scrollable-container" style={{ height: '75vh', overflow: 'auto'}}>
            <table className="ui table small compact brown">
                <thead>
                    <tr>
                        <th key={`header-check`}>
                            <Checkbox checked={ selectedLines.length > 0 && selectedLines.length === lines.length } 
                                onChange={(_e, { checked }) => selectAll(setSelectedLines, lines, checked) } />
                        </th>
                        { thead }
                    </tr>
                </thead>
                <tbody>
                    { tbody } 
                </tbody>
                <tfoot>
                    <tr>
                        <th></th>
                        { totals }
                    </tr>
                </tfoot>
            </table>
        </section>
        <section style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgb(212, 212, 213)' }}>
            <div>
                <button className="ui icon button primary" onClick={() => addLine(setLines, cols)}>
                    <i aria-hidden="true" className="plus icon"></i> Nouvelle ligne
                </button>
                <button disabled={selectedLines.length === 0} className="ui icon button red" onClick={() => removeLines(setLines, setSelectedLines, selectedLines)}>
                    <i aria-hidden="true" className="trash icon"></i> Supprimer les lignes
                </button>
            </div>
        </section>
    </article>
    );
}

function lineChange(setLines, lineNumber, col, val) {
    setLines(prevLines => {
        const newLines = [...prevLines];
        newLines[lineNumber][col.id] = val;
        if (col.id === 'ht') {
            const tva = newLines[lineNumber]['tva'] / 100;
            newLines[lineNumber]['ttc'] = Math.round(val * (1 + tva) * 100) / 100;
        }
        return newLines;
    });
}

function addLine(setLines, cols) {
    setLines(prevLines => {
        const newLines = [...prevLines];
        const newLine = {};
        cols.forEach(col => newLine[col.id] = col.defaultValue);
        newLines.push(newLine);
        setTimeout(() => scrollToBottom('#ledger-scrollable-container'), 200);
        return newLines;
    });
}

function selectAll(setSelectedLines, lines, checked) {
    setSelectedLines(_prevSelectedLines => {
        return checked ? lines.map((_line, index) => index): [];
    });
}

function select(setSelectedLines, lineNumber, checked) {
    setSelectedLines(prevSelectedLines => {
        let newSelectedLines = [...prevSelectedLines];
        if (checked) {
            newSelectedLines.push(lineNumber);
        } else {
            const idx = newSelectedLines.findIndex(selectedLine => selectedLine === lineNumber);
           newSelectedLines.splice(idx, 1);
        }
        return newSelectedLines;
    });
}

function removeLines(setLines, setSelectedLines, selectedLines) {
    setLines(prevLines => {
        let newLines = [];
        prevLines.forEach((line, index) => {
          if (!selectedLines.some(idx => index === idx)) {
            newLines.push(line);
          }
        });
        setSelectedLines(() => []);
        return newLines;
    });
}

// Write values to new file
function saveAs(currentFile, setCurrentFile, fileChange, setLines, lines, cols, setActionMessage) {
    
    const filePath = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), {
        title: 'Sauvegarde du livre de recette',
        filters: [{
            name: 'csv',
            defaultPath: currentFile,
            extensions: ['csv']
        }]
    });

    if (filePath) { // if user cancelled, filePath is undefined
        save(filePath, setLines, lines, cols, setActionMessage)
            .then(() => { 
                setCurrentFile(filePath);
                fileChange(filePath);
            });
    }
}

// Write values to given file
function save(filePath, setLines, lines, cols, setActionMessage) {

    const sortedLines = sortByCol(lines, 'date');
    return writeData(filePath, cols, sortedLines)
        .then(_success => {
            setLines(sortedLines);
            const now = new Date();
            setActionMessage({ type: 'positive', message: `Enregistrement effectué à ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}` });
        });
}

// Write values to current file
function checkErrorsThen(lines, cols, setErrors, setActionMessage, fn) {

    // Check error on every existing lines
    const errors = lines.map((line, lineNumber) => validateLine(line, lineNumber, cols))
        .filter(error => error.cols.length > 0);

    // Perform save action if no error
    if (errors.length === 0) {
        setErrors(() => []);
        setActionMessage(undefined);
        fn();
    } else {
        setErrors(() => errors);
        setActionMessage({ type: 'negative', message: 'Enregistrement impossible, veuillez corriger les erreurs' });
        setTimeout(() => scrollTo('#ledger-scrollable-container', `#body-cell-${errors[0].lineNumber}-${cols[0].id}`), 200);
    }
}

// Open CSV file
function open(currentFile, setCurrentFile, fileChange, setLines, cols) {
    const defaultPath = currentFile;
    const filePath = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
        title: 'Ouverture du livre de recette',
        filters: [{
            name: 'csv',
            defaultPath,
            extensions: ['csv'],
        }]
    });
    if (filePath && filePath.length > 0) { // if user cancelled, filePath is undefined
        readData(filePath[0], cols).then(readLines => setLines(readLines));
        setCurrentFile(filePath[0]);
        fileChange(filePath[0]);
    }
}

// Return error object if any for given line
function validateLine(line, lineNumber, cols) {
    return {
        lineNumber,
        cols: cols.filter(col => col.required && !line[col.id])
    };
}

// Return error message to display if any for given line / column
function getErrorMsg(lineNumber, errors, col) {
    const error = errors.filter(err => err.lineNumber === lineNumber);
    return error.length === 0 ? undefined : error[0].cols.some(errorCol => col.id === errorCol.id) ?
        (<i className="icon attention" title="Obligatoire"></i>) : '';
}

// Search the given col for text, then scroll to it
function search(searchResults, setSearchResults, searchText, searchColId, lines) {

    if (!searchResults) {
        const regexp = new RegExp(searchText, 'gi');
        searchResults = [];
        lines.forEach((line, index) => {
            if (line[searchColId] && `${line[searchColId]}`.search(regexp) >= 0) {
                searchResults.push(index);
            }
        });
   }
   if (searchResults.length > 0) {
        const lineIndex = searchResults.shift();
        const cellId = `#body-cell-${lineIndex}-${searchColId}`;
        scrollTo('#ledger-scrollable-container', cellId);
        document.querySelectorAll('input').forEach(input => input.style.backgroundColor = 'transparent');
        document.querySelector(cellId).querySelector('input').style.backgroundColor = 'yellow';
    }
    setSearchResults(searchResults);
}
