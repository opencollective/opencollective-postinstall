const chalk = require('chalk');
const execSync = require('child_process').execSync;

const padding = function(length) {
  let padding = '';
  for (var i=0; i<length; i++) {
    padding += ' ';
  }
  return padding;
}

const print = function(str, opts = { color: null, align: 'center'}) {
  opts.align = opts.align || 'center';
  const terminalCols = parseInt(execSync(`tput cols`).toString());
  const strLength = str.replace(/\u001b\[[0-9]{2}m/g,'').length;
  const leftPaddingLength = (opts.align === 'center') ? Math.floor((terminalCols - strLength) / 2) : 2; 
  const leftPadding = padding(leftPaddingLength);
  if (opts.color) {
    str = chalk[opts.color](str);
  }

  console.log(leftPadding, str);
}

module.exports = {
  padding,
  print
};
