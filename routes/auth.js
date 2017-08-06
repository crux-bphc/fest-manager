var express = require('express');
var router = express.Router();
var passport = require('passport');

var callbackHandler = function (req, res) {
	if (req.session.callback) {
		var url = req.session.callback;
		delete req.session.callback;
		res.redirect(url);
	} else
	if (req.user.institute && req.user.name) {
		res.redirect('/dashboard');
	} else
		res.redirect('/dashboard/account');
};

router.get('/facebook',
	passport.authenticate('facebook', {
			scope: ['public_profile', 'email']
		},
		function (req, res) {}
	));

router.get('/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/login'
	}), callbackHandler);

router.get('/google',
	passport.authenticate('google', {
			scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email']
		},
		function (req, res) {}
	));

router.get('/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/login'
	}), callbackHandler);

router.get('/github',
	passport.authenticate('github', {
			scope: ['user:email']
		},
		function (req, res) {}
	));

router.get('/github/callback',
	passport.authenticate('github', {
		failureRedirect: '/login'
	}), callbackHandler);

module.exports = router;
