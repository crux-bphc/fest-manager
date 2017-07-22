var express = require('express');

/* routing CRUD operations for users service */
function service(model, router) {
	router.get('/', function (req, res, next) {
		model.find(function (err, items) {
			if (err) {
				err.status = 500;
				next(err);
				return 0;
			}
			res.send(items);
		});
	});

	router.get('/:id', function (req, res, next) {
		model.find({
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

	router.post('/', function (req, res, next) {
		var item = new model(req.body);
		item.save(function (err) {
			if (err) {
				res.send("Error");
				return 0;
			}
			res.send("Success");
		});
	});

	router.put('/', function (req, res, next) {
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

	router.delete('/:id', function (req, res, next) {
		model.findByIdAndRemove(req.params.id, function (err, item) {
			if (err) {
				err.status = 500;
				next(err);
			}
			res.send("Success");
		});
	});
	return router;
}

module.exports = service;
