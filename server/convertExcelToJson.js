// convertExcelToJson.js

const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const convertExcelToJson = () => {
  try {
    // Load the Excel file
    const workbook = xlsx.readFile(path.join(__dirname, 'Edo datasets.xlsx'));
    const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Write data to a JSON file
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2));
    console.log('Excel data has been converted to JSON and saved as data.json');
  } catch (error) {
    console.error('Error converting Excel to JSON:', error);
  }
};

convertExcelToJson();
