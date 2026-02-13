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

  for (const sale of salesData) {
    const priceUSD = convertToUSD(sale.price, sale.currency);
    const taxRate = getTaxRate(sale.type);
    totalRevenue += priceUSD;
    totalTax += priceUSD * taxRate;
  }

  return {
    totalItems: salesData.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
  };
}

module.exports = { processSales, convertToUSD, getTaxRate, EXCHANGE_RATES, TAX_RATES };
