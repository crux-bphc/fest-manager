var express = require('express');
var router = express.Router();
var eventsService = require("../api/services/events").model;

/* GET users listing. */
router.get('/', function (req, res, next) {
	eventsService.find(function (err, events) {
		if (err) next(err);
		res.renderState('events', {
			title: 'Events',
			user: req.user,
			events: events
		}, function (err, string) {
			res.send({
				html: string,
				state: req.appState
			});
		});
	});
});

router.get('/:eventroute', function (req, res, next) {
	console.log('Route:', req.params.eventroute);
	eventsService.findOne({
		route: req.params.eventroute,
	}, function(err, data){
		console.log('Error:', err);
		console.log('Data:', data);
		if (err) next(err);
		res.renderState('single-event', {
			title: data.name,
			user: req.user,
			event: data,
		});
	});
});

module.exports = router;
