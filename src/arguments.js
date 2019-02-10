const yargs = require('yargs');
const dotEnv = require('dotenv');

const args = yargs
  .option('tabs', {
    alias: 't',
    demand: false,
    default: 3,
    describe: 'Tabs number per browser',
    type: 'number'
  })
  .option('headless', {
    alias: 'hl',
    demand: false,
    default: true,
    describe: 'Launches browser interface',
    type: 'boolean'
  })
  .options('modules', {
    describe: 'Module or modules to run, to use more than one, split them with commas',
    type: 'string'
  })
  .options('enableLogs', {
    alias: 'logs',
    default: false,
    describe: 'Displays logs',
    type: 'boolean'
  })
  .options('writeModes', {
    alias: 'write',
    default: 'disk',
    describe: 'Defines where to write the result file. To define more than one, split them with commas. example: disk,ftp',
    type: 'string'
  })
  .help('h')
  .alias('h', 'help')
  .argv;

dotEnv.config();

const { tabs, modules: modulesList, headless, enableLogs, write } = args;
const writeModes = write.split(',');
const moduleNames = modulesList ? modulesList.split(',') : [];

if (!moduleNames.length) {
  throw new Error('Invalid argument: There must be at least one module to execute.');
}

if (tabs > 9) {
  throw new Error('Invalid argument: Tabs must be 9 or less.');
}

// eslint-disable-next-line global-require, import/no-dynamic-require
const modules = moduleNames.map(module => require(`./modules/${module}`));

module.exports = { tabs, modules, headless, enableLogs, writeModes };
