var express = require('express');
var router = express.Router();
var events = require('./events');
var dashboard = require('./dashboard');
var portals = require('./portals');
var login = require('./login');
var immersive = require('./immersive');

/* GET users listing. */
router.get('/', function (req, res, next) {
	if (req.isAuthenticated())
		res.redirect('/components/dashboard');
	else
		res.redirect('/components/events');
});

router.use('/events', events);
router.use('/dashboard', dashboard);
router.use('/portals', portals);
router.use('/immersive', immersive);
router.use('/login', login);
router.use('/logout', function (req, res, next) {
	req.logout();
	res.redirect('/components/login');
});

module.exports = router;
