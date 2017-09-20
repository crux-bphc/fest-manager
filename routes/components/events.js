var express = require('express');
var router = express.Router();
var eventsService = require("../api/services/events").model;

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'Events',
		route: '/events',
	};
	req.stateparams.submenu = [{
			label: "Competitions",
			route: "/events#Competition"
		},
		{
			label: "Workshops",
			route: "/events#Workshop"
		},
		{
			label: "Talks",
			route: "/events#Talk"
		},
		{
			label: "Conferences",
			route: "/events#Conference"
		}
	];
	return req;
};

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = 'Events';
	req = applyStateChanges(req);
	eventsService.find(function (err, events) {
		if (err) return next(err);

		var compare = function (a, b) {
			if (a.name > b.name)
				return true;
			return false;
		};

		events.sort(compare);

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
		route: req.params.eventroute
	}, function (err, data) {
		if (err) return next(err);
		if (!data) {
			var err1 = new Error('Not Found');
			err1.status = 404;
			return next(err1);
		}
		if (data.route.startsWith('@')) {
			var myurl = '/components/' + data.route.split('@')[1];
			return res.redirect(myurl);
		}
		if (data.immersive) {
			req.stateparams.immersive = false;
		}
		req.stateparams.pagetitle = data.name;
		var marked = require('marked');
		marked.setOptions({
		  renderer: new marked.Renderer(),
		  gfm: true,
		  tables: true,
		  breaks: false,
		  pedantic: false,
		  sanitize: false,
		  smartLists: true,
		  smartypants: false
		});
		res.renderState('events/event', {
			title: data.name,
			user: req.user,
			event: data,
			marked: marked,
		});
	});
});

module.exports = router;
