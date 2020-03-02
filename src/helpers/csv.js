import { sortByCol } from './sort';

let remote;
if (process.env.REACT_APP_MODE === 'electron') {
    remote = window.require('electron').remote;
}


export function writeData(path, header, data) {

    const createCsvWriter = window.require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({ path, header: header.map(col => ({...col, title: col.id})) });

    return csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));

}

export function readData(path, cols) {

    const numberCols = cols.filter(col => col.type === 'Number');

    return new Promise((resolve, reject) => {

        const csvParser = window.require('csv-parser');
        const fs = window.require('fs');
        
        const lines = [];

        fs.createReadStream(path)
            .pipe(csvParser())
            .on('headers', (headers) => {})
            .on('data', (line) => {
                numberCols.forEach(col => {
                    if (line[col.id]) {
                        line[col.id] = 1 * line[col.id];
                    }
                });
                lines.push(line);
            })
            .on('end', () => {
                resolve(lines);
            });
    });
}



// Write values to new file
export function saveAs(currentFile, setCurrentFile, fileChange, setLines, setHighlightedLines, setSelectedLines, lines, cols, setActionMessage) {
    
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
                setHighlightedLines([]);
                setSelectedLines([]);
            });
    }
}


// Open CSV file
export function open(currentFile, setCurrentFile, fileChange, setLines, setHighlightedLines, setSelectedLines, setActionMessage, cols) {
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
        setHighlightedLines([]);
        setSelectedLines([]);
        setCurrentFile(filePath[0]);
        setActionMessage(null);
        fileChange(filePath[0]);
    }
}


// Write values to given file
export function save(filePath, setLines, setHighlightedLines, setSelectedLines, lines, cols, setActionMessage) {

    const sortedLines = sortByCol(lines, 'date');
    return writeData(filePath, cols, sortedLines)
        .then(_success => {
            setLines(sortedLines);
            setHighlightedLines(_prev => []);
            setSelectedLines(_prev => []);
            const now = new Date();
            setActionMessage({ type: 'positive', message: `Enregistrement effectué à ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}` });
        })
        .then(error => console.log(error));
}

