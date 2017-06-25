var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var usersSchema = new Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	institute: {
		type: String
	},
	teams: [Schema.Types.ObjectId],
	accommodation: Schema.Types.ObjectId,
	token: String,
	facebookID: String,
	googleID: String,
	githubID: String,
	privilege: Schema.Types.Mixed
}, {
	timestamps: true
});

var model = mongoose.model('users', usersSchema);

module.exports = {
	route: '/users',
	model: model,
	router: router,
};
