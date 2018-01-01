var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var fq = require('fuzzquire');
var router = express.Router();
var middleware = fq('authentication').middleware;

var schema = new Schema({
	sport: {
		type: String, // Team Name.
		required: true,
	},
	team1: String,
	team2: String,
	text: {
		type: String,
		required: true,
	},
}, {
	timestamps: true
});

var model = mongoose.model('feed', schema);

router.put('/add', middleware.authenticate, middleware.elevate, (req, res, next) => {
	console.log(req.body);
	if (!(req.body.sport && req.body.text)) {
		return res.status(500).send("Incomplete Request");
	}
	console.log("Here");
	model.insert(req.body).then(result => {
		console.log('added');
		res.send("Success");
	}).catch(error => {
		console.log(error);
		res.status(500).send(error);
	});
});

module.exports = {
	route: '/scores/feed',
	model: model,
	router: router,
};
