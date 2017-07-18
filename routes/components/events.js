var express = require('express');
var router = express.Router();
var eventsService = require("../api/services/events").model;

/* GET users listing. */
router.get('/', function (req, res, next) {
	eventsService.find(function (err, events) {
		if (err) next(err);
		req.stateparams.title = {
			text: 'Events',
			route: '/events',
		};
		req.stateparams.submenu = [{
				label: "Competitions"
			},
			{
				label: "Workshops"
			},
			{
				label: "Proshows"
			}
		];
		res.renderState('events', {
			title: 'Events',
			user: req.user,
			events: events
		});
	});
});

router.get('/:eventroute', function (req, res, next) {
	eventsService.findOne({
		route: req.params.eventroute,
	}, function (err, data) {
		if (err) next(err);
		if (data.immersive) {
			req.stateparams.immersive = false;
		}
		res.renderState('events/single-event', {
			title: data.name,
			user: req.user,
			event: data,
		});
	});
});

module.exports = router;
