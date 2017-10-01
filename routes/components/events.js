var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var eventsService = fq("services/events").model;

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

		events = events.filter(e => !e.route.endsWith('!'));

		events.sort(function (a, b) {
			if (a.name > b.name) return 1;
			if (a.name < b.name) return -1;
			return 0;
		});

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
		data.route = data.route.replace('!', '');
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
