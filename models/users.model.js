var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var usersSchema = new Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    institute: {type: String, required: true},
    events: [Schema.Types.ObjectId],
    accommodation: Schema.Types.ObjectId,
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('usersModel',usersSchema);