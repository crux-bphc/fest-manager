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
		{
			label: "Schedule",
			route: "/pybits/schedule",
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

router.get('/talks/saikat', function (req, res, next) {
	req.stateparams.pagetitle = 'Talk by Saikat Kumar Dey';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Talks";
	res.renderState('custom/pybits/talks/saikat', {
		title: 'Building a chatbot from scratch using Open-Source tools',
		user: req.user,
		pybits: true,
	});
});

router.get('/talks/satish', function (req, res, next) {
	req.stateparams.pagetitle = 'Talk by Satish Rao';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Talks";
	res.renderState('custom/pybits/talks/satish', {
		title: 'Internet of Things (IoT) and Python',
		user: req.user,
		pybits: true,
	});
});

router.get('/talks/madhu', function (req, res, next) {
	req.stateparams.pagetitle = 'Talk by Madhu Vadlamani';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Talks";
	res.renderState('custom/pybits/talks/madhu', {
		title: 'Impact of Python in Data Science',
		user: req.user,
		pybits: true,
	});
});

router.get('/talks/ramanathan', function (req, res, next) {
	req.stateparams.pagetitle = 'Talk by Ramanathan Muthaiah';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Talks";
	res.renderState('custom/pybits/talks/ramanathan', {
		title: 'Introduction to Continuous Integration in SW Development',
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
	req.stateparams.subtitle = "PyBITS Workshops";
	res.renderState('custom/pybits/workshops', {
		title: 'PyBITS Workshops',
		user: req.user,
		pybits: true,
	});
});

router.get('/workshops/basic', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Basic Python Workshop';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Workshops";
	res.renderState('custom/pybits/workshops/basic', {
		title: 'PyBITS Basic Python Workshop',
		user: req.user,
		pybits: true,
	});
});

router.get('/workshops/scrapy', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Scrapy Workshop';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Workshops";
	res.renderState('custom/pybits/workshops/scrapy', {
		title: 'PyBITS Scrapy Workshop',
		user: req.user,
		pybits: true,
	});
});

router.get('/workshops/flask', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Flask Workshop';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Workshops";
	res.renderState('custom/pybits/workshops/flask', {
		title: 'PyBITS Flask Workshop',
		user: req.user,
		pybits: true,
	});
});

router.get('/2016', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS 2016';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS 2016";
	res.renderState('custom/pybits/2016', {
		title: 'PyBITS 2016',
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

router.get('/schedule', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Schedule';
	req = applyStateChanges(req);
	req.stateparams.subtitle = "PyBITS Schedule";
	res.renderState('custom/pybits/schedule', {
		title: 'PyBITS Schedule',
		user: req.user,
	});
});

module.exports = router;
