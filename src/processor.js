const EXCHANGE_RATES = {
  USD: 1.00,
  EUR: 1.10,
  CAD: 0.75,
};

const TAX_RATES = {
  clothing: 0.05,
  merchandise: 0.15,
  digital: 0.00,
};

const DEFAULT_TAX_RATE = 0.10;

function validateSale(sale, index) {
  const label = sale.sku || `row ${index + 1}`;

  if (!sale.currency) {
    throw new Error(`Missing currency for ${label}`);
  }
  if (sale.price === undefined || sale.price === null || sale.price === '') {
    throw new Error(`Missing price for ${label}`);
  }
  if (typeof sale.price !== 'number' || isNaN(sale.price)) {
    throw new Error(`Non-numeric price for ${label}`);
  }
  if (sale.price < 0) {
    throw new Error(`Negative price for ${label}`);
  }
  if (!sale.type) {
    throw new Error(`Missing type for ${label}`);
  }
}

function convertToUSD(price, currency) {
  const rate = EXCHANGE_RATES[currency];
  if (rate === undefined) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return price * rate;
}

function getTaxRate(type) {
  return TAX_RATES[type] !== undefined ? TAX_RATES[type] : DEFAULT_TAX_RATE;
}

function processSales(salesData) {
  let totalRevenue = 0;
  let totalTax = 0;
  const items = [];

  for (let i = 0; i < salesData.length; i++) {
    const sale = salesData[i];
    validateSale(sale, i);

    const priceUSD = convertToUSD(sale.price, sale.currency);
    const taxRate = getTaxRate(sale.type);
    const tax = Math.round(priceUSD * taxRate * 100) / 100;

    totalRevenue += priceUSD;
    totalTax += tax;

    items.push({
      date: sale.date,
      sku: sale.sku,
      originalPrice: sale.price,
      currency: sale.currency,
      type: sale.type,
      priceUSD: Math.round(priceUSD * 100) / 100,
      tax,
    });
  }

  return {
    totalItems: salesData.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    items,
  };
}

module.exports = { processSales, convertToUSD, getTaxRate, validateSale, EXCHANGE_RATES, TAX_RATES };
