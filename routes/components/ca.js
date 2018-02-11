var express = require('express');
var router = express.Router();

var getFields = function (user) {
	var fields = [];
	fields.push({
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
		name: "institute",
		label: "Institute",
		editable: true,
		type: "text",
		required: true,
		value: user.institute,
		typeahead: true,
		none: true,
	});
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
		type: "textarea",
		rows: "2",
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
		placeholder: "Why should you be Campus Ambassador",
		editable: true,
		type: "textarea",
		rows: 3,
		required: true,
		value: user.why,
		typeahead: false,
		none: true,
	});
	return fields;
};

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = "Campus Ambassador";
	req.stateparams.immersive = false;
	var params = {
		title: 'Register for Campus Ambassador',
		user: req.user,
	};
	if (req.user)
		params.fields = getFields(req.user);
	res.renderState('ambassador', params);
});

module.exports = router;
