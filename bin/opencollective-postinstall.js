#!/usr/bin/env node
const collective_url = process.env.npm_package_collective_url;
const collective_logo = process.env.npm_package_collective_logo;
const lifecycle_event = process.env.npm_lifecycle_event;

const utils = require("../lib/utils");

/**
 * If we are not on a fancy TTY, just show a barebone message
 * without fancy emoji, centering, fetching data, etc.
 */
if(!utils.isFancyEnvironment()) {
  console.log("");
  console.log("     *** Thank you for using " + process.env.npm_package_name + "! ***");
  console.log("");
  console.log("Please consider donating to our open collective");
  console.log("     to help us maintain this package.");
  console.log("");
  console.log("  " + collective_url + "/donate");
  console.log("");
  console.log("                    ***");
  console.log("");
  process.exit(0);
}

const debug = utils.debug;
const fs = require("fs");
const fetchData = require("../lib/fetchData");
const print = require("../lib/print");

const padding = utils.padding;
const fetchStats = fetchData.fetchStats;
const fetchLogo = fetchData.fetchLogo;
const printLogo = print.printLogo;
const printFooter = print.printFooter;
const printStats = print.printStats;

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

if (lifecycle_event !== "postinstall") {
  console.error("This script should be run as a postinstall script. Please add it to your package.json.");
  console.log("e.g.:");
  console.log(padding(4), "{");
  console.log(padding(6), "\"scripts\": {");
  console.log(padding(8), "\"postinstall\": \"./node_modules/.bin/opencollective-postinstall\"");
  console.log(padding(6), "}");
  console.log(padding(4), "}");
  return process.exit(0);
} else if (collective_url) {
  init();
}