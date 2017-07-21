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
		},
		{
			route: "/dashboard/CampusAmbassador",
			label: "Campus Ambassador"
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
	if(isAmbassador) {
		fields.push({
			name: "phone",
			label: "Phone",
			placeholder: "Phone",
			editable: true,
			type: "text",
			required: true,
			value: user.phone,
			typeahead: false,
			none: true,
		});
		fields.push({
			name: "address",
			label: "Address",
			editable: true,
			type: "text",
			required: true,
			placeholder: "Full address",
			value: user.address,
			typeahead: false,
			none: true,
		});
		fields.push({
			name: "pincode",
			label: "Pincode",
			placeholder: "Pincode",
			editable: true,
			type: "text",
			required: true,
			value: user.pincode,
			typeahead: false,
			none: true,
		});
		fields.push({
			name: "year",
			label: "Year",
			placeholder: "Which year are you in?",
			editable: true,
			type: "select",
			required: true,
			options: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'],
			value: user.year,
			typeahead: false,
			none: true,
		});
		fields.push({
			name: "why",
			label: "Why you",
			placeholder: "Tell us why you should be Campus Ambassador",
			editable: true,
			type: "textarea",
			required: true,
			value: user.why,
			typeahead: false,
			none: true,
		});
	}
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
		res.renderState('dashboard/dashboard', params);
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

router.get('/CampusAmbassador', authenticate, function (req, res, next) {
	req.stateparams.pagetitle = "Atmos - Campus Ambassador";
	var params = {
		title: 'Register for Campus Ambassador',
		user: req.user,
	};
	req = applyStateChanges(req);
	params.fields = getFields(req.user, true);
	res.renderState('dashboard/ambassador', params);
});

router.get('/cart', authenticate, function (req, res, next) {

	var eventModel = require("../api/services/events").model;

	req = applyStateChanges(req);
	eventModel.find({_id: {$in: req.user.events}}, function(err, result){
		if(err){
			console.log("ERROR: " + err);
			params.error = "Error finding events";
			return;
		}
		var params = {
			title: 'Cart',
			user: req.user,
			events: result
 		};
		res.renderState('dashboard/cart', params);
	});
});

module.exports = router;
