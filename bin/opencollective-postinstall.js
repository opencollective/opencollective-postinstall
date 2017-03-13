#!/usr/bin/env node
const fs = require('fs');
const { padding } = require('../lib/utils');
const { fetchStats, fetchLogo } = require('../lib/fetchData');
const { printLogo, printFooter, printStats } = require('../lib/print');
const setup = require('../setup');

const {
  npm_package_name,
  npm_package_collective_url,
  npm_package_collective_logo,
  npm_package_collective_suggested_donation_amount,
  npm_package_collective_suggested_donation_interval,
  npm_lifecycle_event,
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

function init() {
  const promises = [];
  promises.push(fetchStats(npm_package_collective_url));
  if (npm_package_collective_logo) {
    promises.push(fetchLogo(npm_package_collective_logo));
  }

  Promise.all(promises)
    .then(results => {
      const stats = results[0];
      const logotxt = results[1];

      if (logotxt) {
        printLogo(logotxt);
      }
      return printFooter(stats);
    })
    .catch(e => {
      console.error("Error caught: ", e);
      printFooter();
    })
}

if (!npm_package_collective_url) {
  setup();
} else if (npm_lifecycle_event !== 'postinstall') {
  console.error(`This script should be run as a postinstall script. Please add it to your package.json.`);
  console.log(`e.g.:`);
  console.log(padding(4), `{`);
  console.log(padding(6), `"scripts": {`);
  console.log(padding(8), `"postinstall": "./node_modules/.bin/opencollective-postinstall"`);
  console.log(padding(6), `}`);
  console.log(padding(4), `}`);
  return process.exit(0);
} else {
  console.log("init");
  init();
}