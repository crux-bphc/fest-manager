var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var authenticate = fq('authentication').middleware.authenticate;
var eventModel = fq("services/events").model;
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


var getFields = function (user, isAmbassador = false) {
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
		// icon: "building",
		name: "institute",
		label: "Institute",
		placeholder: "Type to Search",
		editable: true,
		type: "text",
		required: true,
		value: user.institute,
		typeahead: "institutes",
		none: true,
	});
	fields.push({
		// icon: "building",
		name: "phone",
		label: "Phone",
		editable: true,
		type: "tel",
		required: true,
		value: user.phone,
		none: true,
	});
	return fields;
};

/* GET users listing. */
router.get('/', authenticate, function (req, res, next) {
	req = applyStateChanges(req);
	var subscribed, pending;
	Promise.all([eventModel.find({
			_id: {
				$in: req.user.pending
			}
		}).then(events => {
			pending = events;
		}), eventModel.find({
			_id: {
				$in: req.user.events
			}
		}).then(events => {
			subscribed = events;
		})])
		.then(function (events) {
			qr.toDataURL(req.user.email, {
				errorCorrectionLevel: 'H'
			}, function (err, url) {
				req.user.qrData = url;
				var params = {
					user: req.user,
					subscribed: subscribed,
					pending: pending,
					title: "Dashboard"
				};
				res.renderState('dashboard/dashboard', params);
			});
		});
});

router.get('/account', authenticate, function (req, res, next) {
	var params = {
		title: 'My Account',
		user: req.user,
	};
	req = applyStateChanges(req);
	params.fields = getFields(req.user);
	res.renderState('dashboard/account', params);
});

router.get('/cart', authenticate, function (req, res, next) {

	req = applyStateChanges(req);
	eventModel.find({
		_id: {
			$in: req.user.pending
		}
	}, function (err, result) {
		var params = {
			title: 'Check Out',
			user: req.user,
			events: result
		};
		if (err || !result.length) {
			params.error = "Error finding events";
		}
		res.renderState('dashboard/cart', params);
	});
});

module.exports = router;
