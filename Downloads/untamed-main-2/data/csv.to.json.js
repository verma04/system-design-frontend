const fs = require('fs');
const csvtojson = require('csvtojson');

const csvFilePath = 'skin.three.con.csv'; // Replace with the actual path to your CSV file
const jsonFilePath = 'r3.json';

csvtojson()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    const jsonString = JSON.stringify(jsonObj, null, 2);

    fs.writeFile(jsonFilePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('Conversion completed. JSON file saved at', jsonFilePath);
      }
    });
  }).catch((err) => {
    console.error('Error converting CSV to JSON:', err);
  });