const XLSX = require("xlsx");

// Step 1: Read file
const workbook = XLSX.readFile("studentdata.xlsx");

// Step 2: Get sheet name
const sheetName = workbook.SheetNames[0];

// Step 3: Get sheet data
const sheet = workbook.Sheets[sheetName];

// Step 4: Convert to JSON
const data = XLSX.utils.sheet_to_json(sheet);

console.log(data);