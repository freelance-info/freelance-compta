import { sortByCol } from './sort';

export function writeData(path, header, data) {
  const createCsvWriter = window.require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({ path, header: header.map(col => ({ ...col, title: col.id })) });
  return csvWriter.writeRecords(data);
}

export function readData(path, cols) {
  const numberCols = cols.filter(col => col.type === 'Number');

  return new Promise(resolve => {
    const csvParser = window.require('csv-parser');
    const fs = window.require('fs');

    const lines = [];

    fs.createReadStream(path)
      .pipe(csvParser())
      .on('headers', () => { })
      .on('data', line => {
        const numbersLine = { ...line };
        numberCols.forEach(col => {
          if (line[col.id]) {
            numbersLine[col.id] = 1 * line[col.id];
          }
        });
        lines.push(numbersLine);
      })
      .on('end', () => {
        resolve(lines);
      });
  });
}

// Write values to given file
export function save(filePath, lines, cols, setActionMessage) {
  const sortedLines = sortByCol(lines, 'date');
  return writeData(filePath, cols, sortedLines)
    .then(() => {
      const now = new Date();
      setActionMessage({
        type: 'positive',
        message: `Enregistrement effectué à ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      });
      return sortedLines;
    });
}

// Write values to new file
export function saveAs(currentFile, setCurrentFile, fileChange, lines, cols, setActionMessage) {

  const remote = window.require('electron').remote;  

  return new Promise((resolve, reject) => {
    const filePath = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), {
      title: 'Sauvegarde du livre de recette',
      filters: [{
        name: 'csv',
        defaultPath: currentFile,
        extensions: ['csv'],
      }],
    });

    if (filePath) { // if user cancelled, filePath is undefined
      save(filePath, lines, cols, setActionMessage)
        .then(sortedLines => {
          setCurrentFile(filePath);
          fileChange(filePath);
          resolve(sortedLines);
        }).catch(reject);
    } else {
      resolve(lines);
    }
  });
}

// Open CSV file
export function open(
  currentFile, setCurrentFile, fileChange, setActionMessage, lines, cols,
) {

  const remote = window.require('electron').remote;  

  return new Promise((resolve, reject) => {
    const defaultPath = currentFile;
    const filePath = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
      title: 'Ouverture du livre de recette',
      filters: [{
        name: 'csv',
        defaultPath,
        extensions: ['csv'],
      }],
    });
    if (filePath && filePath.length > 0) { // if user cancelled, filePath is undefined
      setCurrentFile(filePath[0]);
      setActionMessage(null);
      fileChange(filePath[0]);
      readData(filePath[0], cols)
        .then(resolve)
        .catch(reject);
    } else {
      resolve(lines);
    }
  });
}
