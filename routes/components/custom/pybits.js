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
			label: "Talks",
			route: "/pybits/talks",
		},
		{
			label: "Workshops",
			route: "/pybits/workshops",
		},
		{
			label: "Proposal",
			route: "/pybits/proposal",
		},
		{
			label: " Brochure",
			route: "/pybits/brochure",
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

router.get('/proposal', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Proposal';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Proposal";
	res.renderState('custom/pybits/proposal', {
		title: 'PyBITS Proposal',
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
router.get('/brochure', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Brochure';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Brochure";
	res.renderState('custom/pybits/brochure', {
		title: 'PyBITS Brochure',
		user: req.user,
	});
});

module.exports = router;
