var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();
var shortid = require('shortid');
shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#@");

var teamsSchema = new Schema({
	_id: {
	    type: String,
	    'default': shortid.generate
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
