// Simple utility to load the config file.
var projectroot = require('project-root-path');
var configfile = process.env.NODE_ENV == 'production' ? 'config.js' : 'dev-config.js';
configfile = projectroot + "/" + configfile;
console.log("config-loader: Trying to use:", configfile);
var config;
try {
	config = require(configfile);
} catch (e) {
	console.error("config-loader: Failed to load config. Trying to use dev config.");
	configfile = projectroot + "/" + 'dev-config.js';
	try {
		config = require(configfile);
	} catch (e) {
		console.log("config-loader: Failed to load dev-config. Something is seriously wrong.");
		console.log("config-loader: You have seriously messed up the repository perhaps. Consider recloning.");
		process.exit(2);
	}
}
module.exports = config;
