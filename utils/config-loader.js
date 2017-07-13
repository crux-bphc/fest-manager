// Simple utility to get the path to config file.
var app = require('../app');
var projectroot = require('project-root-path');
var configfile = process.env.NODE_ENV == 'production' ? 'config.js' : 'dev-config.js';
configfile = projectroot + "/" + configfile;
console.log("config-loader: Trying to use:", configfile);
module.exports = require(configfile);
