var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var schema = new Schema({
	label: String, // Team Name.
	gold: [String],
	silver: [String],
	bronze: [String],
	pending: [String],
}, {
	timestamps: true
});

var model = mongoose.model('leaderboard', schema);

module.exports = {
	route: '/scores/leaderboard',
	model: model,
	router: router,
};
