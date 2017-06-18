//Import the mongoose module
var connection = function() {
    var mongoose = require('mongoose');
    var mongoDB = 'mongodb://127.0.0.1/fest-manager-2';
    mongoose.connect(mongoDB);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
module.exports = connection;
