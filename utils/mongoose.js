//Import the mongoose module
var connection = function (callback) {
	var mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
	const config = require('./config-loader');
	var mongoDB = config.database.url + config.database.name;
	mongoose.connect(mongoDB, {
		useMongoClient: true,
	});
	var db = mongoose.connection;
	db.on('error', function (error) {
		console.error.bind(console, 'mongoose: MongoDB connection error:');
		if (callback) callback(error);
	});
	db.on('connected', function () {
		console.log("mongoose: Connected to", config.database.name);
		if (callback) callback(null, config.database.name);
	});
};
module.exports = connection;
