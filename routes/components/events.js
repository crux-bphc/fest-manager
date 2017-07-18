var express = require('express');
var router = express.Router();
var eventsService = require("../api/services/events").model;

var applyStateChanges = function (req) {
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
	return req;
};

router.get('/', function (req, res, next) {
	req = applyStateChanges(req);
	eventsService.find(function (err, events) {
		if (err) next(err);
		res.renderState('events/home', {
			title: 'Events',
			user: req.user,
			events: events
		});
	});
});

router.get('/:eventroute', function (req, res, next) {
	req = applyStateChanges(req);
	eventsService.findOne({
		route: req.params.eventroute,
	}, function (err, data) {
		if (err) next(err);
		if (data.immersive) {
			req.stateparams.immersive = false;
		}
		res.renderState('events/event', {
			title: data.name,
			user: req.user,
			event: data,
		});
	});
});

module.exports = router;
