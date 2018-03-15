const fq = require('fuzzquire');
const config = fq('config-loader');
const mongo_express = require('mongo-express/lib/middleware');

let mconf = require('mongo-express/config.default');

// Customize the default config here.

mconf.options.console = false;

if (!config.admin.username || !config.admin.password) {
	console.log('launcher: Could not launch mongo admin. Missing config parameters.');
	module.exports = (req, res, next) => {
		next({
			message: 'So long, and thanks for all the fish.',
		});
	};
	return;
}

mconf.basicAuth.username = config.admin.username;
mconf.basicAuth.password = config.admin.password;
mconf.mongodb.connectionString = config.database.url + config.database.name;

const middleware = mongo_express(mconf);
console.log('launcher: Starting mongo admin on /sudo.');
module.exports = middleware;
