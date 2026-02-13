const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const required = ['date', 'sku', 'price', 'currency', 'type'];
  for (const field of required) {
    if (!headers.includes(field)) {
      throw new Error(`CSV missing required column: ${field}`);
    }
  }

  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    obj.price = parseFloat(obj.price);
    if (isNaN(obj.price)) {
      throw new Error(`Invalid price value for SKU: ${obj.sku}`);
    }
    return obj;
  });
}

function parseJSON(content) {
  const data = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new Error('JSON file must contain an array of sales records');
  }
  return data;
}

function parseFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, 'utf-8');

  if (ext === '.csv') {
    return parseCSV(content);
  } else if (ext === '.json') {
    return parseJSON(content);
  } else {
    throw new Error(`Unsupported file format: ${ext}. Use .csv or .json`);
  }
}

module.exports = { parseFile, parseCSV, parseJSON };
