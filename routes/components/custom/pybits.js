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
	req.stateparams.subtitle = "PyBITS 2017";
	req.stateparams.submenu = [{
			label: "Talks",
			route: "/pybits/talks",
		},
		{
			label: "Sprints",
			route: "/pybits/sprints",
		},
		{
			label: "Workshops",
			route: "/pybits/workshops",
		},
		{
			label: "PyBITS 2016",
			route: "/pybits/2016",
		},
		{
			label: "Code of Conduct",
			route: "/pybits/coc",
		},
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

router.get('/sprints', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Sprints';
	req = applyStateChanges(req);
	// res.renderState('custom/pybits/sprints', {
	req.stateparams.subtitle = "Page Under Construction";
	res.renderState('wip', {
		title: 'PyBITS Sprints',
		user: req.user,
		pybits: true,
	});
});

router.get('/workshops', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Workshops';
	req = applyStateChanges(req);
	// res.renderState('custom/pybits/workshops', {
	req.stateparams.subtitle = "PyBITS Workshops";
	res.renderState('custom/pybits/workshops', {
		title: 'PyBITS Workshops',
		user: req.user,
		pybits: true,
	});
});

router.get('/2016', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS 2016';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/2016', {
		title: 'PyBITS 2016',
		user: req.user,
	});
});

router.get('/coc', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Code of Conduct';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/coc', {
		title: 'PyBITS Code of Conduct',
		user: req.user,
	});
});

module.exports = router;
