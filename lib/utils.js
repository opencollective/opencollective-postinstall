const chalk = require('chalk');

const debug = function() {
  if (process.env.DEBUG && process.env.DEBUG.match(/postinstall/i)) {
    console.log.apply(this, arguments);
  }
}

const isDevEnvironment = function() {
  if (process.env.OC_POSTINSTALL_TEST) return true;
  if (process.env.CI || process.env.CONTINUOUS_INTEGRATION) return false;
  return (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development');
}

const isFancyEnvironment = function() {
  return (isDevEnvironment() && process.stdout.isTTY && process.platform !== 'win32');
}

const padding = function(length) {
  var padding = '';
  for (var i=0; i<length; i++) {
    padding += ' ';
  }
  return padding;
}

const formatCurrency = function(amount, currency, precision) {
  precision = precision || 0;
  amount = amount/100; // converting cents

  return amount.toLocaleString(currency, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits : precision,
    maximumFractionDigits : precision
  });
}

module.exports = {
  isDevEnvironment: isDevEnvironment,
  isFancyEnvironment: isFancyEnvironment,
  debug: debug,
  padding: padding,
  formatCurrency: formatCurrency
};
