const args = require('./arguments');
const manager = require('./manager');
const { makeFileForRendering } = require('./utils');

console.log('processing...');
manager.init(args).then(makeFileForRendering);
