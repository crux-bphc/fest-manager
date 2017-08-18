var express = require('express');
var router = express.Router();
var eventsService = require("../api/services/events").model;

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'Events',
		route: '/events',
	};
	req.stateparams.submenu = [{
			label: "Tech Expo",
			route: "/events/techexpo"
		},
		{
			label: "PyBITS",
			route: "/pybits"
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
		res.renderState('events/event', {
			title: data.name,
			user: req.user,
			event: data,
			marked: require('marked')
		});
	});
});

router.get('/pdf/:event', function (req, res, next) {
	req = applyStateChanges(req);
	eventsService.findOne({
		route: req.params.event.split('.')[0]
	}, function (err, data) {
		if (err) return next(err);
		if (!data) {
			var err1 = new Error('Not Found');
			err1.status = 404;
			return next(err1);
		}
		console.log("*******.Event found.*******");

		const PDFDocument = require('pdfkit');
		const base64 = require('base64-stream');
		const doc = new PDFDocument({autoFirstPage: false});
		var final = 'data:application/pdf;base64,';

		//PDF CONTENTS
		doc.addPage({
			margin: 25
		});

		var stream = doc.pipe(base64.encode());
		doc.end();

		stream.on('data', function(chunk) {
    		final += chunk;
		});

		stream.on('end', function() {
    		console.log(final);
    		res.renderState("events/pdf", {data: final});
		});
	});
});

module.exports = router;
