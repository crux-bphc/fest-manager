var express = require('express');
var fq = require('fuzzquire');
var middleware = fq('authentication').middleware;

/* routing CRUD operations for users service */
function service(model, router) {
	router.get('/', function (req, res, next) {
		if (req.query.page) {
			model.paginate({}, {
				page: req.query.page,
				limit: 10,
			}).then(data => {
				res.json(data);
			}).catch(error => {
				console.log(err);
				res.status(500).send("There was some error. Please check the syntax or contact an admin.");
				return;
			});
		} else {
			model.find({}).then(data => {
				if (req.query.sort && data[0][req.query.sort] !== undefined) {
					data = fq('sort')(data, req.query.sort);
				}
				res.json(data);
			}).catch(error => {
				console.log(err);
				res.status(500).send("There was some error. Please check the syntax or contact an admin.");
				return;
			});
		}
	});

	router.get('/:id', function (req, res, next) {
		model.findOne({
			_id: req.params.id
		}, function (err, item) {
			if (err) {
				console.log(err);
				res.status(500).send("There was some error. Please check the syntax or contact an admin.");
				return;
			}
			res.send(item);
		});
	});

	router.post('/get-one', middleware.authenticate, middleware.elevate, function (req, res, next) {
		model.findOne(req.body.filter, function (err, item) {
			if (err) {
				console.log(err);
				res.status(500).send("There was some error. Please check the syntax or contact an admin.");
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
