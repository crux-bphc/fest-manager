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
	req.stateparams.pagetitle = 'PyBits';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/home', {
		title: 'PyBits',
		user: req.user,
	});
});

router.get('/talks', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBits Talks';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/talks', {
		title: 'PyBits Talks',
		user: req.user,
	});
});

router.get('/sprints', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBits Sprints';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/sprints', {
		title: 'PyBits Sprints',
		user: req.user,
	});
});

router.get('/workshops', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBits Workshops';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/workshops', {
		title: 'PyBits Workshops',
		user: req.user,
	});
});

router.get('/2016', function (req, res, next) {
	req.stateparams.pagetitle = 'PyBits 2016';
	req = applyStateChanges(req);
	res.renderState('custom/pybits/2016', {
		title: 'PyBits 2016',
		user: req.user,
	});
});

module.exports = router;
