var express = require('express');
var router = express.Router();
var custom = require('./custom');
var events = require('./events');
var dashboard = require('./dashboard');
var portals = require('./portals');
var about = require('./about');
var login = require('./login');

/* GET users listing. */
router.get('/', function (req, res, next) {
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
router.use('/login', login);
router.use('/logout', function (req, res, next) {
	req.logout();
	res.redirect('/components/login');
});

module.exports = router;
