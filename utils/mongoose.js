//Import the mongoose module
var connection = function (callback) {
	var mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
	var mongoDB = 'mongodb://127.0.0.1/fest-manager';
	mongoose.connect(mongoDB);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
	db.on('connected', function () {
		if (callback) callback(null);
	});
};
module.exports = connection;
