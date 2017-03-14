const fs = require('fs');
const inquirer = require('inquirer');
const { loadMainPackageJSON } = require('./lib/utils');
const { fetchLogo } = require('./lib/fetchData');
const { printLogo } = require('./lib/print');

const package = loadMainPackageJSON();

var questions = [
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

const askQuestions = function() {
  console.log("");
  console.log("You don't have any collective set in your package.json");
  console.log("Let's fix this, shall we?");
  console.log("");
  inquirer.prompt(questions).then(answers => {
    console.log(`Updating package.json...`);
    package.collective = {
      type: "opencollective",
      url: `https://opencollective.com/${answers.collectiveSlug}`
    }
    const logo = answers.logo || answers.showLogo;
    if (logo) {
      package.collective.logo = logo;
    }
    let postinstall = "./node_modules/.bin/opencollective-postinstall";
    if (package.scripts.postinstall && package.scripts.postinstall.indexOf(postinstall) === -1) {
      package.scripts.postinstall = `${package.scripts.postinstall} && ${postinstall}`;
    } else {
      package.scripts.postinstall = postinstall;
    }
    fs.writeFileSync(packageJSONFile, JSON.stringify(package, null, 2), 'utf8');
    console.log("Done.");
    console.log("");
    console.log("Protip: You can also suggest a donation amount.");
    console.log("See the docs for more options: https://github.com/opencollective/opencollective-postinstall");
    console.log("");
    console.log("Have a great day!");
    return process.exit(0);
  });
}

const setup = function() {
  console.log("");
  fetchLogo("https://opencollective.com/opencollective/logo.txt")
    .then(printLogo)
    .then(askQuestions);
}

module.exports = setup;