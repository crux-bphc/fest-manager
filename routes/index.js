var express = require('express');
var router = express.Router();
var passport = require('passport');
var fq = require('fuzzquire');
var authenticate = fq('authentication').middleware.authenticate;
/* GET home page. */
router.get('/?*', function (req, res, next) {
	var params = {
		title: 'Home',
		user: req.user,
		route: req.url,
		navigation: {
			home: {
				label: "Home",
				route: "/",
			},
			about: {
				label: "About",
				route: "/about",
			},
			events: {
				label: "Events",
				route: "/events",
			},
			workshops: {
				label: "Workshops",
				route: "/events#Workshop",
			},
			dashboard: {
				label: "Dashboard",
				route: "/dashboard",
				initial: "disabled",
				require: {
					path: "user/isAuthenticated",
					for: "visible"
				},
			},
			ca: {
				label: "Campus Ambassador",
				route: "/ca",
			},
			portals: {
				route: "/portals",
				initial: "disabled",
				require: {
					path: "user/isElevated",
					for: "visible"
				},
				label: "Portals"
			}
		}
	};

	Object.keys(params.navigation).forEach(function (key) {
		params.navigation[key].triggers = 'sidebar/menu/' + key + '=active ';
		if (params.navigation[key].require) {
			params.navigation[key].triggers += params.navigation[key].require.path + "=" + params.navigation[key].require.for;
		}
	});

	res.render('index', fq('options').updateOptions(params));
});


module.exports = router;
