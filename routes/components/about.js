var express = require('express');
var router = express.Router();

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'About',
		route: '/about',
	};
	req.stateparams.submenu = [{
			label: "Get in Touch",
			route: "/about/contact",
		},
		{
			label: "How to Reach",
			route: "/about/map",
		},
		// {
		// 	label: "Sponsors",
		// 	route: "/about/sponsors",
		// },
		// {
		// 	label: "Credits",
		// 	route: "/about/credits",
		// },
		{
			label: "History of Atmos",
			route: "/about/history",
		},
	];
	return req;
};

router.get('/', function (req, res, next) {
	req = applyStateChanges(req);
	res.renderState('about/home', {
		title: 'About Atmos',
		user: req.user
	});
});

router.get('/contact', function (req, res, next) {
	req = applyStateChanges(req);
	res.renderState('about/contact', {
		title: 'Get in Touch',
		user: req.user
	});
});

router.get('/map', function (req, res, next) {
	req = applyStateChanges(req);
	res.renderState('about/map', {
		title: 'How to Reach',
		user: req.user
	});
});

router.get('/history', function (req, res, next) {
	req = applyStateChanges(req);
	res.renderState('about/history', {
		title: 'History of Atmos',
		user: req.user
	});
});

module.exports = router;
