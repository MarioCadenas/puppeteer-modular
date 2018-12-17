const yargs = require('yargs');

const args = yargs
  .option('tabs', {
    alias: 't',
    demand: false,
    default: 9,
    describe: 'Tabs number per browser',
    type: 'number'
  })
  .option('headless', {
    alias: 'hl',
    demand: false,
    default: true,
    describe: 'Launch browser interface',
    type: 'boolean'
  })
  .option('env', {
    alias: 'e',
    default: 'pro',
    type: 'string'
  })
  .option('media', {
    alias: 'm',
    default: '',
    describe: '',
    type: 'string'
  })
  .options('modules', {
    default: 'publiModule',
    describe: 'Module or modules to run, to use more than one, split them with commas',
    type: 'string'
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const { tabs, env, media, modules: modulesList, headless } = args;
const moduleNames = modulesList ? modulesList.split(',') : [];

if (moduleNames.length === 0) {
  throw new Error('Invalid argument: There must be at least one module to execute.');
}

if (tabs > 9) {
  throw new Error('Invalid argument: Tabs must be 9 or less');
}

// eslint-disable-next-line global-require, import/no-dynamic-require
const modules = moduleNames.map(module => require(`./modules/${module}`));

module.exports = { tabs, modules, env, media, headless };
