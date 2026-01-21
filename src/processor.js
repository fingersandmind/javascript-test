function processSales(salesData) {
  // TODO: Implement business logic here.
  // 1. Loop through sales
  // 2. Convert currency to USD
  // 3. Calculate tax based on type
  // 4. Return summary object { totalItems, totalRevenue, totalTax }

  return {
    totalItems: 0,
    totalRevenue: 0.00,
    totalTax: 0.00
  };
}

module.exports = { processSales };
