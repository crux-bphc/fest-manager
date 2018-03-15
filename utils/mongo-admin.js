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

// Hide errors and warnings from this module. They use outdated mongo
// and session store implementations. The warning is about a memory leak
// on using this portal, which, in testing, turns out to not be much for
// our usecase because of the very less number of sessions.
// TODO: Find permanent fix.
global.logging.error = false;
global.logging.warn = false;
const middleware = mongo_express(mconf);
global.logging.error = true;
global.logging.wanr = true;
console.log('launcher: Starting mongo admin on /sudo.');
module.exports = middleware;
