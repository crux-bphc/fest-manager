var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', passport.authenticate('facebook', {failureRedirect: '/login'}), function(req, res, next) {
  res.render('registration', { title: 'Registration' });	
});

module.exports = router;
