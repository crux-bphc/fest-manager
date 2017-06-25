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

module.exports = router;
