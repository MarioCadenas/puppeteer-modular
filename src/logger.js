const chalk = require('chalk');
const { enableLogs } = require('./arguments');

module.exports = {
  log(message, ...params) {
    if (enableLogs) { console.log(chalk.white(message, stringify(...params))); }
  },
  warn(message, ...params) {
    if (enableLogs) { console.log(chalk.yellow(message, stringify(...params))); }
  },
  error(message, ...params) {
    if (enableLogs) { console.log(chalk.red(message, stringify(...params))); }
  },
  timeStart(label) {
    if (enableLogs) { console.time(label); }
  },
  timeEnd(label) {
    if (enableLogs) { console.timeEnd(label); }
  }
};

/** Private functions */
const stringify = (...params) => Object
  .values(params)
  .map(param => (typeof param === 'object' ? JSON.stringify(param, null, 2) : param));
