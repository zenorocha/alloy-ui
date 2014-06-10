var requireDir = require('require-dir');
var tasksDir = requireDir('./tasks');

// Temporary fix for OS X's low file descriptors limit default of 256 files
// Same effect as `ulimit -n 20000`
require('./scripts/ulimit').increaseDarwinLowFileDescriptorsLimit(20000);

// Add the node_modules/.bin directory to the PATH
require('spawn-local-bin').path(__dirname);