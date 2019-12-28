import React, { useState } from 'react';
import { Checkbox } from 'semantic-ui-react';
import CellEdit from './CellEdit';
import { writeData } from '../helpers/csv';
const remote = window.require('electron').remote;

// Livre des recettes
export default function AccountLedger() {

    const [cols, setCols] = useState([
            { id: 'date', title: 'Date', type: 'Date', required: true },
            { id: 'ref', title: 'Réf. de la facture', type: 'Text', required: false },
            { id: 'client', title: 'Client', type: 'Text', required: false },
            { id: 'nature', title: 'Nature', type: 'Text', required: true },
            { id: 'ht', title: 'Montant HT', type: 'Number', required: false },
            { id: 'ttc', title: 'Montant TTC', type: 'Number', required: true },
            { id: 'tva', title: 'TVA', type: 'Number', required: false },
            { id: 'mode', title: "Mode d'encaissement", type: 'Text', required: false },
    ]);
    const [lines, setLines] = useState([
            { date: '2012-01-10', client: 'CGI', nature: 'Presta 10j', ht: 3000, ttc: 3300, tva: 300 },
            { date: '2012-01-20', client: 'CGI', nature: 'Presta 8j', ht: 2000, ttc: 2300, tva: 300 },
            { date: '2012-02-10', client: 'Capgemini', nature: 'Forfait 10j', ht: 3050, ttc: 3350, tva: 300 },
            { date: '2012-02-22', client: 'Capgemini', nature: 'Presta 3j', ht: 4000, ttc: 4300, tva: 300 },
            { date: '2012-02-30', client: 'Capgemini', nature: 'Presta 5j', ht: 1000, ttc: 1200, tva: 200 },
            { date: '2012-03-10', client: 'Accenture', nature: 'Presta 11j', ht: 800, ttc: 900, tva: 100 },
    ]);

    const [newLine, setNewLine] = useState({});

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
    
    const lastLine = cols.map((col, colNumber) => {
        const errorMsg = getErrorMsg(-1, errors, col);
        return (
            <td key={`lastLine-cell-${colNumber}`} className={errorMsg ? 'error' : ''}>
                <CellEdit 
                    def={col}
                    value={newLine[col.id]}
                    onChange={ (val) => newLineChange(setNewLine, col, val) }>
                </CellEdit>
                { errorMsg || '' }
            </td>
        );
    });
    
    tbody.push((
        <tr key={`lastLine`}>
            <td></td>
            { lastLine }
        </tr>
    ));
    
    return (
    <section>
        <table className="ui table small compact brown">
            <thead>
                <tr>
                    <th key={`header-check`}>
                        <Checkbox checked={ selectedLines.length === lines.length } 
                            onChange={(e, { checked }) => selectAll(setSelectedLines, lines, checked) } />
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
                        <button className="ui icon button primary" onClick={() => addLine(setLines, setNewLine, newLine)}>
                            <i aria-hidden="true" className="plus icon"></i> Nouvelle ligne
                        </button>
                        <button disabled={selectedLines.length === 0} className="ui icon button red" onClick={() => removeLines(setLines, setSelectedLines, selectedLines)}>
                            <i aria-hidden="true" className="trash icon"></i> Supprimer les lignes
                        </button>
                        <button className="ui icon button green" onClick={() => save(setLines, lines, cols, newLine, setNewLine, setErrors)}>
                            <i aria-hidden="true" className="disk icon"></i> Enregistrer
                        </button>
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


function newLineChange(setNewLine, col, val) {
    setNewLine(prevNewLine => {
        const newLine = {...prevNewLine};
        newLine[col.id] = val;
        return newLine;
    });
}

function addLine(setLines, setNewLine, newLine) {
    setLines(prevLines => {
        const newLines = [...prevLines];
        newLines.push({...newLine});
        setNewLine(() => ({}));
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
        let newLines = [...prevLines];
        selectedLines.forEach(index => newLines.splice(index, 1));
        setSelectedLines(() => []);
        return newLines;
    });
}

// Write values to file
function save(setLines, lines, cols, newLine, setNewLine, setErrors) {

    // Check error on every existing lines
    const errors = lines.map((line, lineNumber) => validateLine(line, lineNumber, cols))
        .filter(error => error.cols.length > 0);

    // Check error on new line if dirty
    const isNewLineDirty = cols.some(col => !!newLine[col.id]);
    if (isNewLineDirty) {
        const newLineError = validateLine(newLine, -1, cols);
        if (newLineError.cols.length > 0) {
            errors.push(newLineError);
        }
    }

    // Perform save action if no error
    if (errors.length === 0) {
        // If new line was dirty, add it to lines and add another new one
        const linesToSave = [...lines];
        if (isNewLineDirty) {
            linesToSave.push(newLine);
            addLine(setLines, setNewLine, newLine, cols);
        }

        const filePath = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), {
            title: 'Sauvegarde du livre de recette',
            filters: [{
                name: 'csv',
                defaultPath: 'livre-de-recette.csv',
                extensions: ['csv']
            }]
        });
        if (filePath) { // if user cancelled, filePath is undefined
            writeData(filePath, cols, lines);
        }
    } else {
        setErrors(() => errors);
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
