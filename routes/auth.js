var express = require('express');
var router = express.Router();
var passport = require('passport');

var fq = require('fuzzquire');
const config = fq('config-loader');

var callbackHandler = function (req, res) {
	if (req.session.callback) {
		var url = req.session.callback;
		delete req.session.callback;
		res.redirect(url);
	} else
	if (req.user.institute && req.user.name && req.user.phone) {
		res.redirect('/dashboard');
	} else
		res.redirect('/dashboard/account');
};
if (config.passports.facebook) {
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
}

if (config.passports.google) {
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
}

if (config.passports.googleToken) {
	router.get('/google/token', passport.authenticate('google-token'), function(req, res){
		res.send(req.user);
	});
}

if (config.passports.github) {
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
}

module.exports = router;
