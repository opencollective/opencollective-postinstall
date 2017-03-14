#!/usr/bin/env node
const fs = require('fs');
const { padding } = require('../lib/utils');
const { fetchStats, fetchLogo } = require('../lib/fetchData');
const { printLogo, printFooter, printStats } = require('../lib/print');
const setup = require('../setup');

const {
  npm_package_collective_url,
  npm_package_collective_logo,
  npm_lifecycle_event
} = process.env;

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
  init();
}