export function writeData(path, header, data) {

    const createCsvWriter = window.require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({ path, header });

    csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));

}