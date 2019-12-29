import React, { useState, useEffect } from 'react';
import { Checkbox } from 'semantic-ui-react';
import CellEdit from './CellEdit';
import { writeData, readData } from '../helpers/csv';
import { findByLabelText } from '@testing-library/react';
const remote = window.require('electron').remote;

// Livre des recettes
export default function AccountLedger() {

    const [cols, _setCols] = useState([
            { id: 'date', title: 'Date', type: 'Date', required: true },
            { id: 'ref', title: 'Réf. de la facture', type: 'Text', required: false, width: '75px' },
            { id: 'client', title: 'Client', type: 'Text', required: false, width: '150px' },
            { id: 'nature', title: 'Nature', type: 'Text', required: true, width: '200px' },
            { id: 'ht', title: 'Montant HT', type: 'Number', required: false, width: '100px' },
            { id: 'ttc', title: 'Montant TTC', type: 'Number', required: true, width: '100px' },
            { id: 'tva', title: 'TVA', type: 'Number', required: false, width: '75px' },
            { id: 'mode', title: "Mode d'encaissement", type: 'Text', required: false, width: '75px' },
    ]);

    const [lines, setLines] = useState([]);
    const defaultPath = localStorage.getItem('accountLedger');
    
    useEffect(() => {
        if (defaultPath && lines.length === 0) {
            readData(defaultPath, cols).then(readLines => setLines(readLines));
        }
    });

    const [selectedLines, setSelectedLines] = useState([]);

    const [errors, setErrors] = useState([]);
    
    const thead = cols.map((col, colNumber) => (<th key={`header-cell-${colNumber}`}>{ col.title }</th>));
    
    const tbody = lines.map((line, lineNumber) => {
        const td = cols.map((col, colNumber) => {
            const errorMsg = getErrorMsg(lineNumber, errors, col);
            return (
                <td key={`body-cell-${lineNumber}-${colNumber}`} className={errorMsg ? 'error' : ''}>
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
    
    return (
    <section>
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
                    <th colSpan={cols.length + 1}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <button className="ui icon button primary" onClick={() => addLine(setLines)}>
                                    <i aria-hidden="true" className="plus icon"></i> Nouvelle ligne
                                </button>
                                <button disabled={selectedLines.length === 0} className="ui icon button red" onClick={() => removeLines(setLines, setSelectedLines, selectedLines)}>
                                    <i aria-hidden="true" className="trash icon"></i> Supprimer les lignes
                                </button>
                            </div>
                            <div>
                                <button className="ui icon button green" onClick={() => open(setLines, cols)}>
                                    <i aria-hidden="true" className="folder open icon"></i> Ouvrir
                                </button>
                                <button className="ui icon button green" onClick={() => save(setLines, lines, cols, setErrors)}>
                                    <i aria-hidden="true" className="save icon"></i> Enregistrer
                                </button>
                            </div>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
    </section>
    );
}

function lineChange(setLines, lineNumber, col, val) {
    setLines(prevLines => {
        const newLines = [...prevLines];
        newLines[lineNumber][col.id] = val;
        return newLines;
    });
}

function addLine(setLines) {
    setLines(prevLines => {
        const newLines = [...prevLines];
        newLines.push({});
        setTimeout(() => window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" }), 200);
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

// Write values to CSV file
function save(setLines, lines, cols, setErrors) {

    // Check error on every existing lines
    const errors = lines.map((line, lineNumber) => validateLine(line, lineNumber, cols))
        .filter(error => error.cols.length > 0);

    // Perform save action if no error
    if (errors.length === 0) {

        const filePath = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), {
            title: 'Sauvegarde du livre de recette',
            filters: [{
                name: 'csv',
                defaultPath: localStorage.getItem('accountLedger'),
                extensions: ['csv']
            }]
        });
        if (filePath) { // if user cancelled, filePath is undefined
            writeData(filePath, cols, lines)
                .then(_success => localStorage.setItem('accountLedger', filePath));
        }
    } else {
        setErrors(() => errors);
    }
}

// Open CSV file
function open(setLines, cols) {
    const defaultPath = localStorage.getItem('accountLedger');
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
        localStorage.setItem('accountLedger', filePath[0]);
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
