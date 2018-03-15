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

var set = function (prop, value) {
	if (prop == undefined || prop == null) {
		prop = value;
	}
	return prop;
};
var setDefaults = function () {
	config.state = set(config.state, {});
	config.admin = set(config.admin, {});
	config.database = set(config.database, {
		name: 'fest-manager-default',
		url: "mongodb://127.0.0.1/",
	});
	config.database.name = set(process.env.FM_DATABASE, config.database.name);
	config.state.registrations = set(config.state.registrations, true);
	config.port = set(config.port, 3000);
};
setDefaults();
module.exports = config;
