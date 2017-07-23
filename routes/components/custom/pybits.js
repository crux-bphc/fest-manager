var express = require('express');
var router = express.Router();

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'PyBITS',
		route: 'pybits',
	};
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
		}
	];
	return req;
};

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/home', {
		title: 'PyBITS',
		user: req.user,
	});
});

router.get('/talks', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Talks';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/talks', {
		title: 'PyBITS Talks',
		user: req.user,
	});
});

router.get('/sprints', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Sprints';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/sprints', {
		title: 'PyBITS Sprints',
		user: req.user,
	});
});

router.get('/workshops', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBITS Workshops';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/workshops', {
		title: 'PyBITS Workshops',
		user: req.user,
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

module.exports = router;
