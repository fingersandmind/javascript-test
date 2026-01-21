const { parseFile } = require('./parser');
const { processSales } = require('./processor');
const chalk = require('chalk');
const Table = require('cli-table3');

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
    const table = new Table({
      head: ['Total Items', 'Total Revenue (USD)', 'Total Tax (USD)'],
      colWidths: [20, 20, 20]
    });
    table.push([
      summary.totalItems,
      `$${summary.totalRevenue.toFixed(2)}`,
      `$${summary.totalTax.toFixed(2)}`
    ]);
    console.log(table.toString());

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
