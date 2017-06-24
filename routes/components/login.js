var express = require('express');
var router = express.Router();

var getUnfinishedProps = function(user){
	var props = [];
	if(!user.name){
		props.push({name: "name", title:"Your name"});
	}
	if(!user.institute){
		props.push({name: "institute", title:"Your college or institute"});
	}
	return props;
}

/* GET users listing. */
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

router.get('/finish', function(req, res, next) {
	var params = {
		title: 'Finish Registration',
		user: req.user,
	}
	if(!user.institute){
		res.renderState('register', params);	 
	}
	// console.log("User:", req.user);
	res.redirect('/dashboard');
});

module.exports = router;
