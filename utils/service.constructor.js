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
				res.status(500).send(error);
			});
		} else {
			model.find({}).then(data => {
				if (req.query.sort && data[0][req.query.sort] !== undefined) {
					data = fq('sort')(data, req.query.sort);
				}
				res.json(data);
			}).catch(error => {
				res.status(500).send(error);
			})
		}
	});

	router.get('/:id', function (req, res, next) {
		model.findOne({
			_id: req.params.id
		}, function (err, item) {
			if (err) {
				err.status = 404;
				next(err);
				return 0;
			}
			res.send(item);
		});
	});

	router.post('/get-one', middleware.authenticate, middleware.elevate, function (req, res, next) {
		model.findOne(req.body.filter, function (err, item) {
			if (err) {
				err.status = 404;
				next(err);
				return 0;
			}
			res.send(item);
		});
	});

	router.post('/', middleware.authenticate, middleware.elevate, function (req, res, next) {
		var item = new model(req.body);
		item.save(function (err) {
			if (err) {
				res.send("Error");
				return 0;
			}
			res.send("Success");
		});
	});

	router.put('/', middleware.authenticate, middleware.elevate, function (req, res, next) {
		model.update({
			_id: req.body._id || req.body.id
		}, req.body, function (err) {
			if (err) {
				err.status = 500;
				next(err);
				return 0;
			}
			res.send("Success");
		});
	});

	router.delete('/:id', middleware.authenticate, middleware.elevate, function (req, res, next) {
		model.findByIdAndRemove(req.params.id, function (err, item) {
			if (err) {
				err.status = 500;
				next(err);
			}
			res.send("Success");
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
				return res.send("Success");
			})
			.catch(error => {
				console.error(error);
				return res.status(500).send("Error");
			});
	});
	return router;
}

module.exports = service;
