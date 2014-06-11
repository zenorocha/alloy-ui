var requireDir = require('require-dir');
var tasksDir = requireDir('./tasks');

// Increase Darwin's (OS X) low (256) file descriptors default soft limit
require('osx-ulimit').set(500000);

// Add the node_modules/.bin directory to the PATH
require('spawn-local-bin').path(__dirname);