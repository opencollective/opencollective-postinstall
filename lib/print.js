const execSync = require('child_process').execSync;
const chalk = require('chalk');
const { padding, formatCurrency } = require('../lib/utils');

const {
  npm_package_name,
  npm_package_collective_url,
  npm_package_collective_suggested_donation_amount,
  npm_package_collective_suggested_donation_interval,
  npm_config_user_agent
} = process.env;

function getDonateURL() {
  let donate_url = npm_package_collective_url;
  if (npm_package_collective_suggested_donation_amount) {
    donate_url += `/donate/${npm_package_collective_suggested_donation_amount}`;
    if (npm_package_collective_suggested_donation_interval) {
      donate_url += `/${npm_package_collective_suggested_donation_interval}`;
    }
    donate_url += (npm_config_user_agent.match(/yarn/)) ? '/yarn' : '/npm';
  }
  return donate_url;
}

const print = function(str, opts = { color: null, align: 'center'}) {
  opts.align = opts.align || 'center';
  const terminalCols = parseInt(execSync(`tput cols`).toString());
  const strLength = str.replace(/\u001b\[[0-9]{2}m/g,'').length;
  const leftPaddingLength = (opts.align === 'center') ? Math.floor((terminalCols - strLength) / 2) : 2; 
  const leftPadding = padding(leftPaddingLength);
  if (opts.color) {
    str = chalk[opts.color](str);
  }

  console.log(leftPadding, str);
}

const printStats = function(stats) {
  if (!stats) return;
  print(`Number of contributors: ${stats.contributorsCount}`);
  print(`Number of backers: ${stats.backersCount}`);
  print(`Annual budget: ${formatCurrency(stats.yearlyIncome, stats.currency)}`);
  print(`Current balance: ${formatCurrency(stats.balance, stats.currency)}`, { color: 'bold' });  
}

const printLogo = function(logotxt) {
  logotxt.split('\n').forEach((line) => print(line, { color: 'blue' }));
}

const printFooter = function(stats) {
  console.log("");
  
  print(`Thanks for installing ${process.env.npm_package_name} 🙏.`, { color: 'yellow' });
  print(`Please consider donating to our open collective`, { color: 'dim' });
  print(`to help us maintain this package.`, { color: 'dim' });
  console.log("");
  printStats(stats);
  console.log("");
  print(`${chalk.bold("👉  Donate:")} ${chalk.underline(getDonateURL())}`);
  console.log("");
}

module.exports = {
  print,
  printLogo,
  printStats,
  printFooter
};
