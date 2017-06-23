var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../utils/authentication').middleware;
/* GET home page. */
router.get('/?*', function (req, res, next) {
	res.render('index', {
		title: 'Home',
		user: req.user,
		route: req.url
	});
});

module.exports = router;
