var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();
var randomString = require('randomstring');

var options = {
	length: 7,
	charset: 'alphanumeric',
	readable: true,
	capitalization: 'uppercase'
};

var teamsSchema = new Schema({
	_id: {
	    type: String,
	    'default': randomString.generate(options)
	},
	name: String,
	members: [Schema.Types.ObjectId],
	event: Schema.Types.ObjectId,
	position: {
		type: String,
		enum: [1, 2, 3, -1],
		default: -1
	}
}, {
	timestamps: true
});

var model = mongoose.model('teamsModel', teamsSchema);

module.exports = {
	route: '/teams',
	model: model,
	router: router,
};
