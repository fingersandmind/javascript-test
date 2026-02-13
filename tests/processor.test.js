const { processSales, convertToUSD, getTaxRate, validateSale } = require('../src/processor');

describe('convertToUSD', () => {
  test('should return same price for USD', () => {
    expect(convertToUSD(100, 'USD')).toBe(100);
  });

  test('should convert EUR to USD', () => {
    expect(convertToUSD(100, 'EUR')).toBeCloseTo(110);
  });

  test('should convert CAD to USD', () => {
    expect(convertToUSD(100, 'CAD')).toBe(75);
  });

  test('should throw for unsupported currency', () => {
    expect(() => convertToUSD(100, 'GBP')).toThrow('Unsupported currency: GBP');
  });
});

describe('getTaxRate', () => {
  test('should return 5% for clothing', () => {
    expect(getTaxRate('clothing')).toBe(0.05);
  });

  test('should return 15% for merchandise', () => {
    expect(getTaxRate('merchandise')).toBe(0.15);
  });

  test('should return 0% for digital', () => {
    expect(getTaxRate('digital')).toBe(0.00);
  });

  test('should return 10% default for unknown type', () => {
    expect(getTaxRate('food')).toBe(0.10);
  });
});

describe('processSales', () => {
  test('should return zero summary for empty data', () => {
    const result = processSales([]);
    expect(result).toEqual({
      totalItems: 0,
      totalRevenue: 0.00,
      totalTax: 0.00,
      items: [],
    });
  });

  test('should process a single USD clothing item', () => {
    const data = [{ price: 20, currency: 'USD', type: 'clothing' }];
    const result = processSales(data);
    expect(result.totalItems).toBe(1);
    expect(result.totalRevenue).toBe(20);
    expect(result.totalTax).toBe(1); // 20 * 0.05
  });

  test('should process a single EUR merchandise item', () => {
    const data = [{ price: 10, currency: 'EUR', type: 'merchandise' }];
    const result = processSales(data);
    expect(result.totalItems).toBe(1);
    expect(result.totalRevenue).toBe(11); // 10 * 1.10
    expect(result.totalTax).toBe(1.65); // 11 * 0.15
  });

  test('should process digital items with zero tax', () => {
    const data = [{ price: 50, currency: 'USD', type: 'digital' }];
    const result = processSales(data);
    expect(result.totalTax).toBe(0);
  });

  test('should process mixed currencies and types', () => {
    const data = [
      { price: 25, currency: 'USD', type: 'clothing' },    // rev: 25, tax: 1.25
      { price: 12.50, currency: 'EUR', type: 'merchandise' }, // rev: 13.75, tax: 2.0625
      { price: 19.99, currency: 'USD', type: 'digital' },   // rev: 19.99, tax: 0
      { price: 5, currency: 'CAD', type: 'merchandise' },   // rev: 3.75, tax: 0.5625
      { price: 60, currency: 'USD', type: 'clothing' },     // rev: 60, tax: 3
    ];
    const result = processSales(data);
    expect(result.totalItems).toBe(5);
    expect(result.totalRevenue).toBe(122.49);
    expect(result.totalTax).toBe(6.87);
  });

  test('should throw on negative price', () => {
    const data = [{ price: -5, currency: 'USD', type: 'clothing', sku: 'BAD' }];
    expect(() => processSales(data)).toThrow('Negative price for BAD');
  });

  test('should return items array with per-item details', () => {
    const data = [
      { date: '2024-01-15', sku: 'SHIRT', price: 20, currency: 'USD', type: 'clothing' },
      { date: '2024-01-16', sku: 'MUG', price: 10, currency: 'EUR', type: 'merchandise' },
    ];
    const result = processSales(data);
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({
      date: '2024-01-15',
      sku: 'SHIRT',
      originalPrice: 20,
      currency: 'USD',
      type: 'clothing',
      priceUSD: 20,
      tax: 1,
    });
    expect(result.items[1]).toEqual({
      date: '2024-01-16',
      sku: 'MUG',
      originalPrice: 10,
      currency: 'EUR',
      type: 'merchandise',
      priceUSD: 11,
      tax: 1.65,
    });
  });
});

describe('validateSale', () => {
  const validSale = { price: 10, currency: 'USD', type: 'clothing', sku: 'A' };

  test('should throw on missing currency', () => {
    expect(() => validateSale({ ...validSale, currency: '' }, 0)).toThrow('Missing currency');
  });

  test('should throw on missing price', () => {
    expect(() => validateSale({ ...validSale, price: undefined }, 0)).toThrow('Missing price');
  });

  test('should throw on negative price', () => {
    expect(() => validateSale({ ...validSale, price: -1 }, 0)).toThrow('Negative price');
  });

  test('should throw on non-numeric price', () => {
    expect(() => validateSale({ ...validSale, price: 'abc' }, 0)).toThrow('Non-numeric price');
  });

  test('should throw on NaN price', () => {
    expect(() => validateSale({ ...validSale, price: NaN }, 0)).toThrow('Non-numeric price');
  });

  test('should throw on missing type', () => {
    expect(() => validateSale({ ...validSale, type: '' }, 0)).toThrow('Missing type');
  });

  test('should use row index as fallback label when sku is missing', () => {
    expect(() => validateSale({ price: -1, currency: 'USD', type: 'clothing' }, 2)).toThrow('row 3');
  });

  test('should pass for a valid sale', () => {
    expect(() => validateSale(validSale, 0)).not.toThrow();
  });
});
