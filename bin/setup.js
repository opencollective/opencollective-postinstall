#!/usr/bin/env node

// Only run in development environment
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'development') {
  process.exit(0);
}

const fs = require('fs');
const inquirer = require('inquirer');
const fetchData = require('../lib/fetchData');
const print = require('../lib/print');
const utils = require('../lib/utils');

const fetchLogo = fetchData.fetchLogo;
const printLogo = print.printLogo;
const debug = utils.debug;

const parentDir = process.cwd().split('/').slice(-2, -1)[0];
if (parentDir !== 'node_modules') {
  // No need to run the setup in standalone mode
  debug("parent dir", parentDir);
  debug("cwd", process.cwd());
  process.exit(0);
}

const projectPackageJSON = '../../package.json';
var package;
try {
  package = JSON.parse(fs.readFileSync(projectPackageJSON, 'utf8'));
} catch(e) {
  debug(`Unable to load ${process.cwd()}/${projectPackageJSON}`, e);
}
if (!package) {
  console.log("Cannot load the `package.json` of your project");
  console.log("Please make sure `opencollective-postinstall` is within the `node_modules` directory of your project.")
  console.log("");
  process.exit(0);
} else if(package.collective && package.collective.url) {
  debug("Open Collective already configured 👌");
  process.exit(0);
}

const askQuestions = function() {

  const questions = [
    {
      type: 'input',
      name: 'collectiveSlug',
      message: 'Enter the slug of your collective (https://opencollective.com/:slug)',
      default: package.name,
      validate: (str) => {
        if(str.match(/^[a-zA-Z\-0-9]+$/)) return true;
        else return 'Please enter a valid slug (e.g. https://opencollective.com/webpack)';
      }
    },
    {
      type: 'list',
      name: 'showLogo',
      message: 'What logo should we use?',
      choices: (answers) => [
        { name: 'Open Collective logo (see above)', value: `https://opencollective.com/opencollective/logo.txt` },
        { name: `The logo of your Collective (https://opencollective.com/${answers.collectiveSlug}/logo.txt)`, value: `https://opencollective.com/${answers.collectiveSlug}/logo.txt` },
        { name: 'Custom URL', value: 'custom'},
        { name: 'No logo', value: null }
      ]
    },
    {
      type: 'input',
      name: 'logo',
      message: 'URL of your logo in ASCII art',
      default: (answers) => `https://opencollective.com/${answers.collectiveSlug}/logo.txt`,
      validate: (str) => {
        if(str.match(/^https?:\/\/[^\/]+\/.+$/)) return true;
        else return 'Please enter a valid url (e.g. https://opencollective.com/webpack/logo.txt)';
      },
      when: (answers) => answers.showLogo === 'custom'
    }
  ];

  console.log("");
  console.log("You don't have any collective set in your package.json");
  console.log("Let's fix this, shall we?");
  console.log("");
  inquirer.prompt(questions).then(answers => {
    console.log(`Updating ${projectPackageJSON}...`);
    package.collective = {
      type: "opencollective",
      url: `https://opencollective.com/${answers.collectiveSlug}`
    }
    const logo = answers.logo || answers.showLogo;
    if (logo) {
      package.collective.logo = logo;
    } else {
      delete package.collective.logo;
    }
    var postinstall = "./node_modules/.bin/opencollective-postinstall || exit 0";
    if (package.scripts.postinstall && package.scripts.postinstall.indexOf(postinstall) === -1) {
      package.scripts.postinstall = `${package.scripts.postinstall} && ${postinstall}`;
    } else {
      package.scripts.postinstall = postinstall;
    }
    fs.writeFileSync(projectPackageJSON, JSON.stringify(package, null, 2), 'utf8');
    console.log("Done.");
    console.log("");
    console.log("Protip: You can also suggest a donation amount.");
    console.log("See the docs for more options: https://github.com/opencollective/opencollective-postinstall");
    console.log("");
    console.log("Have a great day!");
    return process.exit(0);
  });
}

console.log("");
fetchLogo("https://opencollective.com/opencollective/logo.txt")
  .then(printLogo)
  .then(askQuestions);
