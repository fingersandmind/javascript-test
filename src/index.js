const { parseFile } = require('./parser');
const { processSales } = require('./processor');

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: npm start -- <path_to_file>');
    process.exit(1);
  }

  const filePath = args[0];

  try {
    // 1. Parse File
    const salesData = parseFile(filePath);

    // 2. Process Data
    const summary = processSales(salesData);

    // 3. Output Results
    console.log('Processing complete.');
    console.log(`Total Items: ${summary.totalItems}`);
    console.log(`Total Revenue (USD): $${summary.totalRevenue.toFixed(2)}`);
    console.log(`Total Tax (USD): $${summary.totalTax.toFixed(2)}`);

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
