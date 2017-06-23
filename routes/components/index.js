var express = require('express');
var router = express.Router();
var events = require('./events');
var dashboard = require('./dashboard');
var portals = require('./portals');
var login = require('./login');

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/dashboard');
  else
    res.redirect('/events');
});

router.use('/events', events);
router.use('/dashboard', dashboard);
router.use('/portals', portals);
router.use('/login', login);
router.use('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
