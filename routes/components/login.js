var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	var params = {
		title: 'Login to Atmos 2017',
		methods: {
			google: true,
			facebook: true,
			github: true
		}
	};
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
	if (!req.user.institute) {
		res.renderState('register', params);
	}
	res.redirect('/dashboard');
});

module.exports = router;
