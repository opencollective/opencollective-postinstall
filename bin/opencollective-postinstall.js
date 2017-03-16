#!/usr/bin/env node
const fs = require('fs');
const utils = require('../lib/utils');
const fetchData = require('../lib/fetchData');
const print = require('../lib/print');

const debug = utils.debug;
const padding = utils.padding;
const fetchStats = fetchData.fetchStats;
const fetchLogo = fetchData.fetchLogo;
const printLogo = print.printLogo;
const printFooter = print.printFooter;
const printStats = print.printStats;

const collective_url = process.env.npm_package_collective_url;
const collective_logo = process.env.npm_package_collective_logo;
const lifecycle_event = process.env.npm_lifecycle_event;

function init() {
  const promises = [];
  promises.push(fetchStats(collective_url));
  if (collective_logo) {
    promises.push(fetchLogo(collective_logo));
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

debug("process.env", process.env);

if (lifecycle_event !== 'postinstall') {
  console.error(`This script should be run as a postinstall script. Please add it to your package.json.`);
  console.log(`e.g.:`);
  console.log(padding(4), `{`);
  console.log(padding(6), `"scripts": {`);
  console.log(padding(8), `"postinstall": "./node_modules/.bin/opencollective-postinstall"`);
  console.log(padding(6), `}`);
  console.log(padding(4), `}`);
  return process.exit(0);
} else if (collective_url) {
  init();
}