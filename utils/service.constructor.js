var express = require('express');
var fq = require('fuzzquire');
var middleware = fq('authentication').middleware;

var getOptions = function (data) {
	var options = {};
	if (data.page) {
		options.page = parseInt(data.page);
		options.limit = parseInt(data.limit) || 10;
	}
	if (data.fields) {
		options.select = data.fields.split(',').join(' ');
	}
	if (data.sort) {
		options.sort = {};
		options.sort[data.sort] = data.direction || 'asc';
	}
	return options;
}

function service(model, router) {
	router.get('/', function (req, res, next) {
		var options = getOptions(req.query);
		var promise = undefined
		if (req.query.page) {
			promise = model.paginate({}, options);
		} else {
			promise = model.find({}, {}, options);
		}
		promise.then(data => {
			res.json(data);
		}).catch(err => {
			console.log(err);
			res.status(500).send(err);
			return;
		});
	});

	router.get('/:id', function (req, res, next) {
		model.findOne({
			_id: req.params.id
		}, function (err, item) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.send(item);
		});
	});

	router.post('/get-one', function (req, res, next) {
		model.findOne(req.body.filter, function (err, item) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.send(item);
		});
	});

	router.post('/', middleware.authenticate, middleware.elevate, function (req, res, next) {
		var item = new model(req.body);
		item.save(function (err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.send({
				status: "Success",
				data: data,
			});
		});
	});

	router.put('/', middleware.authenticate, middleware.elevate, function (req, res, next) {
		model.update({
			_id: req.body._id || req.body.id
		}, req.body, function (err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.send({
				status: "Success",
				data: data,
			});
		});
	});

	router.delete('/:id', middleware.authenticate, middleware.elevate, function (req, res, next) {
		model.findByIdAndRemove(req.params.id, function (err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.send({
				status: "Success",
				data: data,
			});
		});
	});

	router.put('/update-one', middleware.authenticate, middleware.elevate, function (req, res, next) {
		model.findOneAndUpdate(req.body.filter, // query
				{
					$set: req.body.data
				}, // operations
				{
					upsert: true
				}) // options
			.then(data => {
				return res.send({
					status: "Success",
					data: data,
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).send(err);
				return;
			});
	});
	return router;
}

module.exports = service;
