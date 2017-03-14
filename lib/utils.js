const chalk = require('chalk');

const debug = function() {
  if (process.env.DEBUG && process.env.DEBUG.match(/postinstall/i)) {
    console.log.apply(this, arguments);
  }
}

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

module.exports = {
  debug,
  padding,
  formatCurrency
};
