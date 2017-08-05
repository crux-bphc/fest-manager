//Import the mongoose module
var connection = function (callback) {
	var mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
	const config = require('./config-loader');
	var mongoDB = config.database.url + config.database.name;
	mongoose.connect(mongoDB);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
	db.on('connected', function () {
		console.log("Connected");
		if (callback) callback(null);
	});
};
module.exports = connection;
