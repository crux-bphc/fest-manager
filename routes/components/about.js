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
			label: "Reaching here",
			route: "/about/map",
		},
		{
			label: "ATMOS 2016",
			route: "https://bits-atmos.org/2016",
		},
		{
			label: "Accomodation",
			route: "/about/accomodation",
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
	req = applyStateChanges(req);
	res.renderState('about/history', {
		title: 'History of Atmos',
		user: req.user
	});
});

router.get('/accomodation', function (req, res, next) {
	req.stateparams.pagetitle = 'Accomodation';
	req = applyStateChanges(req);
	res.renderState('about/accomodation', {
		title: 'Accomodation',
		user: req.user
	});
});

module.exports = router;
