const chalk = require('chalk');

const padding = function(length) {
  let padding = '';
  for (var i=0; i<length; i++) {
    padding += ' ';
  }
  return padding;
}

const formatCurrency = function(amount, currency, precision = 0) {
  amount = amount/100; // converting cents

  return amount.toLocaleString(currency, {
    style: 'currency',
    currency,
    minimumFractionDigits : precision,
    maximumFractionDigits : precision
  });
}

const loadMainPackageJSON = function(attempts) {
  attempts = attempts || 1;
  if (attempts > 5) {
    throw new Error('Can\'t resolve main package.json file');
  }
  var mainPath = attempts === 1 ? './' : Array(attempts).join("../");
  try {
    if (process.env.DEBUG) console.log("Trying to load package.json from", process.cwd(), mainPath + 'package.json');
    return require.main.require(mainPath + 'package.json');
  } catch (e) {
    return loadMainPackageJSON(attempts + 1);
  }
}


module.exports = {
  padding,
  formatCurrency,
  loadMainPackageJSON
};
