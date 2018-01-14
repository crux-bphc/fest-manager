//Import the mongoose module
var connection = function (callback) {
	var mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
	const config = require('./config-loader');
	var databasename = process.env.FM_DATABASE || config.database.name || "fest-manager-default";
	var mongoDB = config.database.url + databasename;
	mongoose.connect(mongoDB, {
		useMongoClient: true,
	});
	var db = mongoose.connection;
	db.on('error', function (error) {
		console.error.bind(console, 'mongoose: MongoDB connection error:');
		if (callback) callback(error);
	});
	db.on('connected', function () {
		console.log("mongoose: Connected to", databasename);
		if (callback) callback(null, databasename);
	});
};
module.exports = connection;
