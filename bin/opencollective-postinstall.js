#!/usr/bin/env node
const SHOW_LOGO = (process.argv.indexOf('--no-logo') === -1);

const fs = require('fs');
const chalk = require('chalk');
const { padding, print } = require('../lib/utils');
const {
  npm_package_name,
  npm_package_collective_url,
  npm_package_collective_suggested_donation_amount,
  npm_package_collective_suggested_donation_interval,
  npm_lifecycle_event,
  npm_config_user_agent
} = process.env;

if (npm_lifecycle_event !== 'postinstall') {
  console.error(`This script should be run as a postinstall script. Please add it to your package.json.`);
  console.log(`e.g.:`);
  console.log(padding(4), `{`);
  console.log(padding(6), `"scripts": {`);
  console.log(padding(8), `"postinstall": "./bin/opencollective-postinstall"`);
  console.log(padding(6), `}`);
  console.log(padding(4), `}`);
  return process.exit(0);
}

if (!npm_package_collective_url) {
  console.info(`There is no "${chalk.bold("collective")}" defined at the root of ${npm_package_name}/package.json.`);
  console.info(`Add this variable with the url of your collective to invite users to donate to your collective.`);
  console.info(`e.g.:`);
  console.info(padding(4), `{`);
  console.info(padding(6), `"name": "${npm_package_name}",`);
  console.info(padding(6), `"collective": {`);
  console.info(padding(8), `"type": "opencollective",`);
  console.info(padding(8), `"url": "${chalk.underline(`https://opencollective.com/${npm_package_name}`)}"`);
  console.info(padding(6), `}`);
  console.info(padding(6), `... `);
  console.info(padding(4), `}`);
  console.info(' ');
  return process.exit(0);
}

let donate_url = npm_package_collective_url;
if (npm_package_collective_suggested_donation_amount) {
  donate_url += `/${npm_package_collective_suggested_donation_amount}`;
  if (npm_package_collective_suggested_donation_interval) {
    donate_url += `/${npm_package_collective_suggested_donation_interval}`;
  }
  donate_url += (npm_config_user_agent.match(/yarn/)) ? '/yarn' : '/npm';
}

function footer() {
  console.log("");
  print(`Thanks for installing ${process.env.npm_package_name} 🙏.`, { color: 'yellow' });
  print(`Please consider donating to our open collective`, { color: 'dim' });
  print(`to help us maintain this package.`, { color: 'dim' });
  console.log("");
  print(`${chalk.bold("👉  Donate:")} ${chalk.underline(donate_url)}`);
  console.log("");
}

if (SHOW_LOGO) {
  const logofilepath = './src/assets/logo.txt';
  const logo = fs.readFileSync('./src/assets/logo.txt','utf8');
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(logofilepath)
  });
  console.log("");
  lineReader.on('line', function (line) {
    print(line, { color: 'blue'} );
  });

  lineReader.on('close', footer);
}
else {
  footer();
}
