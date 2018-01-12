var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var fq = require('fuzzquire');
var router = express.Router();
var middleware = fq('authentication').middleware;

var schema = new Schema({
	name: String, // Team Name.
	gold: [String],
	silver: [String],
	bronze: [String],
	others: [String],
}, {
	timestamps: true
});

schema.plugin(require('mongoose-paginate'));
var model = mongoose.model('leaderboard', schema);

router.put('/add', middleware.authenticate, middleware.elevate, (req, res, next) => {
	model.findOne({
		name: req.body.name,
	}).then(data => {
		if (!data) {
			data = {
				name: req.body.name,
				gold: [],
				silver: [],
				bronze: [],
				others: [],
			};
		}
		if (req.body.rank == 1) {
			if (data.gold.indexOf(req.body.sport) == -1) data.gold.push(req.body.sport);
		} else if (req.body.rank == 2) {
			if (data.silver.indexOf(req.body.sport) == -1) data.silver.push(req.body.sport);
		} else if (req.body.rank == 3) {
			if (data.bronze.indexOf(req.body.sport) == -1) data.bronze.push(req.body.sport);
		} else {
			if (data.others.indexOf(req.body.sport) == -1) data.others.push(req.body.sport);
		}
		return model.findOneAndUpdate({
			name: req.body.name
		}, data, {
			upsert: true
		});
	}).then(result => {
		res.send("Success");
	}).catch(error => {
		res.status(500).send(error);
	});
});

router.get('/bits', (req, res, next) => {
	model.find({}).then(data => {
		var newdata = data.filter(elem => {
			if(elem.name) return elem.name.startsWith('Birla Institute of Technology');
			return false;
		});
		res.json(newdata);
	})
});

module.exports = {
	route: '/scores/leaderboard',
	model: model,
	router: router,
};
