var express = require('express');
var router = express.Router();
var userService = require('../api/services/users').model;

router.get('/', function (req, res, next) {
	var params = {
		title: 'Login to Atmos 2017',
		methods: {
			google: true,
			facebook: true,
			github: true
		}
	};
	if (req.user) {
		res.redirect("/components/dashboard");
	}
	if (req.query.error) {
		if (req.query.error == "github_email_is_private") {
			params.error = {
				title: "Github email is private",
				message: "Change your account settings to make your email visible or login with some other provider."
			};
		}
	}
	res.renderState('login', params);
});

router.get('/finish', function (req, res, next) {
	var params = {
		title: 'Finish Registration',
		user: req.user,
	};
	console.log("User:", req.user);
	console.log("Check:", !req.user);
	if (!req.user) {
		res.redirect('/components/login');
	}
	if (!req.user.institute) {
		res.renderState('register', params);
	}
	res.redirect('/components/dashboard');
});

module.exports = router;
