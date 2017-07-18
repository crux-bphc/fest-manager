var express = require('express');
var router = express.Router();

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'PyBits',
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
		}
	];
	return req;
};

router.get('/', function (req, res, next) {
	req = applyStateChanges(req);
	res.renderState('custom/pybits/home', {
		title: 'PyBits',
		user: req.user,
	});
});

router.get('/talks', function (req, res, next) {
	req = applyStateChanges(req);
	res.renderState('custom/pybits/talks', {
		title: 'PyBits Talks',
		user: req.user,
	});
});

router.get('/sprints', function (req, res, next) {
	req = applyStateChanges(req);
	res.renderState('custom/pybits/sprints', {
		title: 'PyBits Sprints',
		user: req.user,
	});
});

router.get('/workshops', function (req, res, next) {
	req = applyStateChanges(req);
	res.renderState('custom/pybits/workshops', {
		title: 'PyBits Workshops',
		user: req.user,
	});
});

module.exports = router;
