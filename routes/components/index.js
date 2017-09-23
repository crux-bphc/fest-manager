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
	req.stateparams.pagetitle = 'Atmos';
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
router.use('/about', about);
router.use('/ca', ca);
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
