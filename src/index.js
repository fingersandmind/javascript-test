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
    const salesData = parseFile(filePath);
    const summary = processSales(salesData);

    const table = new Table({
      colWidths: [17, 14, 7],
    });

    table.push(
      [{ colSpan: 3, content: chalk.bold.cyan('Sales Summary'), hAlign: 'center' }],
      [chalk.bold('Total Items'), summary.totalItems, ''],
      [chalk.bold('Total Revenue'), `$${summary.totalRevenue.toFixed(2)}`, chalk.gray('(USD)')],
      [chalk.bold('Total Tax'), `$${summary.totalTax.toFixed(2)}`, chalk.gray('(USD)')]
    );

    console.log(table.toString());
  } catch (err) {
    console.error(chalk.red('Error:'), err.message);
    process.exit(1);
  }
}

main();
