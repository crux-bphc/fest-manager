var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/facebook',
	passport.authenticate('facebook', {
			scope: ['public_profile', 'email']
		},
		function (req, res) {}
	));

router.get('/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/login'
	}),
	function (req, res) {
		res.redirect('/dashboard');
	});

router.get('/google',
	passport.authenticate('google', {
			scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email']
		},
		function (req, res) {}
	));

router.get('/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/login'
	}),
	function (req, res) {
		res.redirect('/dashboard');
	});

router.get('/github',
	passport.authenticate('github', {
			scope: ['user:email']
		},
		function (req, res) {}
	));

router.get('/github/callback',
	passport.authenticate('github', {
		failureRedirect: '/login'
	}),
	function (req, res) {
		res.redirect('/dashboard');
	});

module.exports = router;
