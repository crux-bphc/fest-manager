var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var fq = require('fuzzquire');
var router = express.Router();
var middleware = fq('authentication').middleware;

var schema = new Schema({
	title: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	authors: [String],
	keywords: [String],
}, {
	timestamps: true
});

var model = mongoose.model('news', schema);

router.get('/index', (req, res, next) => {
	model.find({}).then(data => {
		data.forEach((elem, index) => {
			data[index].text = "(redacted)";
		});
		res.json(data);
	}).catch(error => {
		res.status(500).send(error);
	});
});

var permission = {
	read_one: 0,
	read_all: 0,
	insert: 1,
	update: 1,
	delete: 2
};

module.exports = {
	route: '/news',
	model: model,
	router: router,
	permission: permission,
};
