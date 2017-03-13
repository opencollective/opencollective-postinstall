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

module.exports = {
  padding,
  formatCurrency
};
