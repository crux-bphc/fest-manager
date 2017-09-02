var express = require('express');
var router = express.Router();

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'About',
		route: '/about',
	};
	req.stateparams.immersive = true;
	req.stateparams.submenu = [{
			label: "Get in Touch",
			route: "/about/contact",
		},
		// {
		// 	label: "How to Reach",
		// 	route: "/about/map",
		// },
		// {
		// 	label: "Sponsors",
		// 	route: "/about/sponsors",
		// },
		// {
		// 	label: "Credits",
		// 	route: "/about/credits",
		// },
		{
			label: "ATMOS 2016",
			route: "https://bits-atmos.org/2016",
		},
	];
	return req;
};

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = 'About';
	req = applyStateChanges(req);
	res.renderState('about/home', {
		title: 'About Atmos',
		user: req.user
	});
});

router.get('/contact', function (req, res, next) {
	req.stateparams.pagetitle = 'Contact';
	req = applyStateChanges(req);
	res.renderState('about/contact', {
		title: 'Get in Touch',
		user: req.user
	});
});

router.get('/map', function (req, res, next) {
	req.stateparams.pagetitle = 'Reach';
	req = applyStateChanges(req);
	res.renderState('about/map', {
		title: 'How to Reach',
		user: req.user
	});
});

router.get('/history', function (req, res, next) {
	req.stateparams.pagetitle = 'History';
	req = applyStateChanges(req);
	res.renderState('about/history', {
		title: 'History of Atmos',
		user: req.user
	});
});

module.exports = router;
