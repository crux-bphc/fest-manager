var express = require('express');
var router = express.Router();
var custom = require('./custom');
var events = require('./events');
var dashboard = require('./dashboard');
var portals = require('./portals');
var ca = require('./ca');
var about = require('./about');
var login = require('./login');

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = 'Arena - Home';
	req.stateparams.immersive = true;
	res.renderState('home.jade', {
		user: req.user,
		title: 'Home'
	});
});

router.use('/', custom);
router.use('/events', events);
router.use('/dashboard', dashboard);
router.use('/portals', portals);
router.use('/privacy-policy', function (req, res, next) {
	console.log('Helo');
	req.stateparams.pagetitle = 'Privacy Policy';
	req.stateparams.subtitle = 'Privacy Policy';
	res.renderState('about/privacy', {
		title: 'Privacy Policy',
		user: req.user
	});
});
// router.use('/ca', ca);
router.use('/login', login);
router.use('/logout', function (req, res, next) {
	req.logout();
	res.redirect('/components/login');
});
router.use('/404', function (req, res, next) {
	req.stateparams.immersive = true;
	res.renderState('errors/404', {
		user: req.user
	});
});

module.exports = router;
