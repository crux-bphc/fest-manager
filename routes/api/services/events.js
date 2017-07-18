var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var eventsSchema = new Schema({
	name: String,
	tagline: String,
	body: String,
	type: String,
	category: String,
	thumbnail: String,
	hero: String,
	about: Schema.Types.Mixed,
	contact: String,
	startTime: Date,
	endTime: Date,
	teams: [Schema.Types.ObjectId],
	price: Number,
	route: String,
	immersive: String,
}, {
	timestamps: true
});

var model = mongoose.model('eventsModel', eventsSchema);

module.exports = {
	route: '/events',
	model: model,
	router: router,
};
