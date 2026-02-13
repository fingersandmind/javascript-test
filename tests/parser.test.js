const path = require('path');
const { parseFile, parseCSV, parseJSON } = require('../src/parser');

describe('parseCSV', () => {
  test('should parse valid CSV content', () => {
    const csv = `date,sku,price,currency,type
2024-01-15,TSHIRT,20.00,USD,clothing
2024-01-16,MUG,15.00,EUR,merchandise`;
    const result = parseCSV(csv);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      date: '2024-01-15',
      sku: 'TSHIRT',
      price: 20,
      currency: 'USD',
      type: 'clothing',
    });
  });

  test('should throw on empty CSV', () => {
    expect(() => parseCSV('date,sku,price,currency,type')).toThrow('empty or has no data rows');
  });

  test('should throw on missing required column', () => {
    const csv = `date,sku,price,currency
2024-01-15,TSHIRT,20.00,USD`;
    expect(() => parseCSV(csv)).toThrow('missing required column: type');
  });

  test('should throw on invalid price', () => {
    const csv = `date,sku,price,currency,type
2024-01-15,TSHIRT,abc,USD,clothing`;
    expect(() => parseCSV(csv)).toThrow('Invalid price');
  });
});

describe('parseJSON', () => {
  test('should parse valid JSON array', () => {
    const json = JSON.stringify([{ date: '2024-01-15', sku: 'A', price: 10, currency: 'USD', type: 'digital' }]);
    const result = parseJSON(json);
    expect(result).toHaveLength(1);
    expect(result[0].sku).toBe('A');
  });

  test('should throw if JSON is not an array', () => {
    expect(() => parseJSON('{"key": "value"}')).toThrow('must contain an array');
  });

  test('should throw on invalid JSON', () => {
    expect(() => parseJSON('not json')).toThrow();
  });
});

describe('parseFile', () => {
  test('should parse the sample CSV file', () => {
    const result = parseFile(path.join(__dirname, '..', 'data', 'orders.csv'));
    expect(result).toHaveLength(5);
    expect(result[0].sku).toBe('TSHIRT-BLUE');
  });

  test('should parse the sample JSON file', () => {
    const result = parseFile(path.join(__dirname, '..', 'data', 'orders.json'));
    expect(result).toHaveLength(3);
    expect(result[0].sku).toBe('KEYCAP-SET');
  });

  test('should throw for non-existent file', () => {
    expect(() => parseFile('nonexistent.csv')).toThrow('File not found');
  });

  test('should throw for unsupported file extension', () => {
    expect(() => parseFile(__filename)).toThrow('Unsupported file format');
  });
});
