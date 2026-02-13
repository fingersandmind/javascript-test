const path = require('path');
const { parseFile, parseCSV, parseJSON, parseCSVLine } = require('../src/parser');

describe('parseCSVLine', () => {
  test('should split a simple line on commas', () => {
    expect(parseCSVLine('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  test('should handle a quoted field containing a comma', () => {
    expect(parseCSVLine('a,"b,c",d')).toEqual(['a', 'b,c', 'd']);
  });

  test('should handle escaped quotes inside a quoted field', () => {
    expect(parseCSVLine('a,"he said ""hi""",b')).toEqual(['a', 'he said "hi"', 'b']);
  });

  test('should handle an empty quoted field', () => {
    expect(parseCSVLine('a,"",b')).toEqual(['a', '', 'b']);
  });

  test('should trim whitespace around fields', () => {
    expect(parseCSVLine('  a , b , c  ')).toEqual(['a', 'b', 'c']);
  });
});

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

  test('should handle quoted fields in CSV rows', () => {
    const csv = `date,sku,price,currency,type
2024-01-15,"SHIRT,BLUE",20.00,USD,clothing`;
    const result = parseCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].sku).toBe('SHIRT,BLUE');
    expect(result[0].price).toBe(20);
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
