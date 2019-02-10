const args = require('./arguments');
const manager = require('./manager');
const Logger = require('./logger');
const { writeManager } = require('./write-manager');

Logger.log('processing...');
Logger.timeStart('analisis');

manager
  .init(args)
  .then(writeManager.writeFile.bind(writeManager));
