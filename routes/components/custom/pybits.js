var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var eventsService = fq("services/events").model;

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'PyBITS',
		route: 'pybits',
	};
	req.stateparams.immersive = true;
	req.stateparams.subtitle = "PyBITS 2018";
	req.stateparams.submenu = [{
			label: "Home",
			route: "/pybits",
		},
		{
			label: "Schedule",
			route: "/pybits/schedule",
		},
		{
			label: "Code of Conduct",
			route: "/pybits/coc",
		},
		{
			label: "Talks",
			route: "/pybits/talks",
		},
		{
			label: "Workshops",
			route: "/pybits/workshops",
		},
		{
			label: "Tickets",
			route: "/pybits/tickets",
		},
		{
			label: "About",
			route: "/pybits/about",
		},
		{
			label: "Dev-Sprint",
			route: "/pybits/dev-sprint"
		}
	];
	return req;
};

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS';
	req = applyStateChanges(req);
	req.stateparams.subtitle = false;
	eventsService.findOne({
			route: "@pybits"
		})
		.then(function (event) {
			res.renderState('custom/pybits/home', {
				title: 'PyBITS',
				user: req.user,
				event: event,
			});
		})
		.catch(next);
});

router.get('/talks', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Talks';
	req = applyStateChanges(req);
	// res.renderState('custom/pybits/talks', {
	req.stateparams.subtitle = "PyBITS Talks";
	res.renderState('custom/pybits/talks', {
		title: 'PyBITS Talks',
		user: req.user,
		pybits: true,
	});
});


router.get('/workshops', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Workshops';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Workshops";
	res.renderState('custom/pybits/workshops', {
		title: 'PyBITS Workshops',
		user: req.user,
		pybits: true,
	});
});

router.get('/tickets', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Tickets';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Tickets";
	res.renderState('custom/pybits/tickets', {
		title: 'PyBITS Tickets',
		user: req.user,
	});
});

router.get('/schedule', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Schedule';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Schedule";
	res.renderState('custom/pybits/schedule', {
		title: 'PyBITS Schedule',
		user: req.user,
	});
});
router.get('/about', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS About';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS About";
	res.renderState('custom/pybits/about', {
		title: 'PyBITS About',
		user: req.user,
	});
});
router.get('/coc', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Code of Conduct';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Code of Conduct";
	res.renderState('custom/pybits/coc', {
		title: 'PyBITS Code of Conduct',
		user: req.user,
	});
});

router.get('/dev-sprint', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Dev Sprint';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Dev Sprint";
	res.renderState('custom/pybits/dev-sprint', {
		title: 'PyBITS Dev Sprint',
		user: req.user,
	});
});


module.exports = router;
