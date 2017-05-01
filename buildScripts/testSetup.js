// This file isn't transiler, hence CommonJS

// Register babel to transpile
require('babel-register')();

// Mocha doesn't understnad bundling CSS, hence ignore
require.extensions['.css'] = function () {};
