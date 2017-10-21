var express = require('express');
var router = express.Router();

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'About',
		route: '/about',
	};
	req.stateparams.immersive = true;
	req.stateparams.submenu = [{
			label: "Contact",
			route: "/about/contact",
		},
		{
			label: "Accommodation",
			route: "/about/accommodation",
		},
		{
			label: "Reaching here",
			route: "/about/map",
		},
		{
			label: "Terms of Service",
			route: "/about/service",
		},
		{
			label: "Privacy Policy",
			route: "/about/privacy",
		},
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
	req.stateparams.pagetitle = 'Reach Us';
	req = applyStateChanges(req);
	res.renderState('about/map', {
		title: 'How to Reach',
		user: req.user
	});
});

router.get('/history', function (req, res, next) {
	req.stateparams.pagetitle = 'History';
	req.stateparams.subtitle = 'History of Atmos';
	req = applyStateChanges(req);
	res.renderState('about/history', {
		title: 'History of Atmos',
		user: req.user
	});
});

router.get('/accommodation', function (req, res, next) {
	req.stateparams.pagetitle = 'Accommodation';
	req.stateparams.subtitle = 'Accommodation';
	req = applyStateChanges(req);
	res.renderState('about/accommodation', {
		title: 'Accommodation Options',
		user: req.user
	});
});

router.get('/privacy', function (req, res, next) {
	req.stateparams.pagetitle = 'Privacy Policy';
	req.stateparams.subtitle = 'Privacy Policy';
	req = applyStateChanges(req);
	res.renderState('about/privacy', {
		title: 'Privacy Policy',
		user: req.user
	});
});

router.get('/service', function (req, res, next) {
	req.stateparams.pagetitle = 'Terms Of Service';
	req.stateparams.subtitle = 'Terms Of Service';
	req = applyStateChanges(req);
	res.renderState('about/service', {
		title: 'Terms Of Service',
		user: req.user
	});
});

module.exports = router;
