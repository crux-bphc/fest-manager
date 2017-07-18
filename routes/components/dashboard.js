var express = require('express');
var router = express.Router();
var authenticate = require('../../utils/authentication').middleware;
const qr = require("qrcode");

var applyStateChanges = function (req) {
	req.stateparams.title = req.stateparams.title = {
		text: 'Dashboard',
		route: '/dashboard',
	};
	req.stateparams.submenu = [{
			route: "/dashboard/account",
			label: "Account"
		},
		{
			route: "/dashboard/cart",
			label: "Cart"
		}
	];
	return req;
};


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
	req = applyStateChanges(req);
	qr.toDataURL(req.user.email, {
		errorCorrectionLevel: 'H'
	}, function (err, url) {
		req.user.qrData = url;
		var params = {
			user: req.user,
			title: "Dashboard"
		};
		res.renderState('dashboard', params);
	});
});

router.get('/account', authenticate, function (req, res, next) {
	var params = {
		title: 'My Account',
		user: req.user,
	};
	req = applyStateChanges(req);
	params.fields = getFields(req.user);
	res.renderState('account', params);
});

module.exports = router;
