var express = require('express');
var router = express.Router();
var authenticate = require('../../utils/authentication').middleware;

var getFields = function (user) {
	var fields = [];
	fields.push({
		icon: "name",
		name: "name",
		label: "Name",
		editable: true,
		type: "text",
		required: true,
		value: user.name,
		typeahead: false,
		none: true,
	});
	fields.push({
		icon: "email",
		name: "email",
		label: "Email",
		editable: false,
		type: "text",
		required: true,
		value: user.email,
		typeahead: false,
		none: true,
	});
	fields.push({
		icon: "building",
		name: "institute",
		label: "Institute",
		editable: true,
		type: "text",
		required: true,
		value: user.institute,
		typeahead: true,
		none: true,
	});
	return fields;
};

/* GET users listing. */
router.get('/', authenticate, function (req, res, next) {
	var params = {
		user: req.user,
		title: "Dashboard"
	};
	req.stateparams.title = 'Dashboard';
	req.stateparams.submenu = [{
			route: "/account",
			label: "Account"
		},
		{
			route: "/cart",
			label: "Cart"
		}
	];
	res.renderState('dashboard', params);
});

router.get('/account', authenticate, function (req, res, next) {
	var params = {
		title: 'My Account',
		user: req.user,
	};
	req.stateparams.title = 'Dashboard';
	req.stateparams.submenu = [{
			route: "/account",
			label: "Account"
		},
		{
			route: "/cart",
			label: "Cart"
		}
	];
	params.fields = getFields(req.user);
	res.renderState('account', params);
});

module.exports = router;
