//Import the mongoose module
var connection = function (callback) {
	var mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
	const config = require('./config-loader');
	var databasename = process.env.FM_DATABASE || config.database.name || "fest-manager-default";
	var mongoDB = config.database.url + databasename;
	mongoose.connect(mongoDB);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
	db.on('connected', function () {
		console.log("Connected to", databasename);
		if (callback) callback(null);
	});
};
module.exports = connection;
