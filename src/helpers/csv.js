export function writeData(path, header, data) {

    const createCsvWriter = window.require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({ path, header: header.map(col => ({...col, title: col.id})) });

    return csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));

}

export function readData(path, cols) {

    return new Promise((resolve, reject) => {

        const csvParser = window.require('csv-parser');
        const fs = window.require('fs');
        
        const lines = [];

        fs.createReadStream(path)
            .pipe(csvParser())
            .on('headers', (headers) => {})
            .on('data', (line) => {
                lines.push(line);
            })
            .on('end', () => {
                resolve(lines);
            });
    });
}
