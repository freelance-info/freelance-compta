import React, { useState } from 'react';
import { Checkbox } from 'semantic-ui-react';
import CellEdit from './CellEdit';

// Livre des recettes
export default function AccountLedger() {

    const [cols, setCols] = useState([
            { code: 'date', label: 'Date', type: 'Date', required: true },
            { code: 'ref', label: 'Réf. de la facture', type: 'Text', required: true },
            { code: 'client', label: 'Client', type: 'Text', required: true },
            { code: 'nature', label: 'Nature', type: 'Text', required: true },
            { code: 'ht', label: 'Montant HT', type: 'Number', required: true },
            { code: 'ttc', label: 'Montant TTC', type: 'Number', required: true },
            { code: 'tva', label: 'TVA', type: 'Number', required: true },
            { code: 'mode', label: "Mode d'encaissement", type: 'Text', required: true },
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

    const [error, setError] = useState({});

    const color = 'brown';
    
    const thead = cols.map((col, colNumber) => (<th key={`header-cell-${colNumber}`}>{ col.label }</th>));
    
    const tbody = lines.map((line, lineNumber) => {
        const td = cols.map((col, colNumber) => (
            <td key={`body-cell-${lineNumber}-${colNumber}`}>
                <CellEdit 
                    def={col}
                    value={ line[col.code] } 
                    onChange={ (val) => lineChange(setLines, setError, lineNumber, col, val) }>
                </CellEdit>
            </td>));
        return (
            <tr key={`body-line-${lineNumber}`}>
                <td key={`body-check-${lineNumber}`}>
                    <Checkbox checked={ selectedLines.some(selectedLine => selectedLine === lineNumber) }
                        onChange={event => select(setSelectedLines, lineNumber, event.target.checked) } />
                </td>
                { td }
            </tr>
        );
    });
    
    const lastLine = cols.map((col, colNumber) => {
        const errorMsg = error.lineNumber === -1 && col.code === error.col.code ? 
            (<div className="ui bottom attached negative message small"><i className="icon exclamation"></i>Requis</div>) : '';
        return (
            <td key={`lastLine-cell-${colNumber}`}>
                <CellEdit 
                    def={col}
                    value={newLine[col.code]}
                    onChange={ (val) => newLineChange(setNewLine, setError, col, val) }>
                </CellEdit>
                { errorMsg }
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
        <table color={color} key={color} className="ui table small compact">
            <thead>
                <tr>
                    <th key={`header-check`}>
                        <Checkbox checked={ selectedLines.length === lines.length } 
                            onChange={event => selectAll(setSelectedLines, lines, event.target.checked) } />
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
                        <button className="ui icon button" onClick={() => addLine(setLines, setNewLine, setError, newLine, cols)}>
                            <i aria-hidden="true" className="plus icon"></i>
                        </button>
                    </th>
                </tr>
            </tfoot>
        </table>
    </section>
    );
}

function lineChange(setLines, setError, lineNumber, col, val) {
    if (col.required && !val) {
        setError(() => ({ lineNumber, col }));
    } else {
        setLines(prevLines => {
            const newLines = [...prevLines];
            newLines[lineNumber][col.code] = val;
            return newLines;
        });
    }
}


function newLineChange(setNewLine, setError, col, val) {
    if (col.required && !val) {
        setError(() => ({ lineNumber: -1, col }));
    } else {
        setNewLine(prevNewLine => {
            const newLine = {...prevNewLine};
            newLine[col.code] = val;
            return newLine;
        });
    }
}

function addLine(setLines, setNewLine, setError, newLine, cols) {
    const invalids = cols.filter(col => col.required && !newLine[col.code]);
    if (invalids.length === 0) {
        setLines(prevLines => {
            const newLines = [...prevLines];
            newLines.push({...newLine});
            setNewLine(() => ({}));
            return newLines;
        });
    } else {
        setError(() => ({ lineNumber: -1, col: invalids[0] }));
    }
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
            newSelectedLines = newSelectedLines.splice(idx, 1);
        }
        return newSelectedLines;
    });
}
