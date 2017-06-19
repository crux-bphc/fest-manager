var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var usersSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    institute: { type: String },
    teams: [Schema.Types.ObjectId],
    accommodation: Schema.Types.ObjectId,
    token: String,
    facebookID: { type: String, unique: true },
    googleID: { type: String, unique: true },
    githubID: { type: String, unique: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('usersModel', usersSchema);
