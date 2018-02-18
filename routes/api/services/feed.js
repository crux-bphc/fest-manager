var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var fq = require('fuzzquire');
var router = express.Router();
var middleware = fq('authentication').middleware;

var schema = new Schema({
	subject: {
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
	if (!(req.body.subject && req.body.text)) {
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

permission = {
	read_one : 0,
	read_all : 0
	insert : 1,
	update : 2,
    delete: 2
};

module.exports = {
	route: '/feed',
	model: model,
	router: router,
	permission: permission
};
