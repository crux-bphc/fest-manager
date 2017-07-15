var express = require('express');
var router = express.Router();
var authenticate = require('../../utils/authentication').middleware;
var bodiesService = require('../api/services/bodies').model;

var elevate = function (req, res, next) {
	if (req.user.privilege)
		return next();
	let error = new Error('Access denied');
	error.status = 404;
	next(error);
};

router.get('/', authenticate, elevate, function (req, res, next) {
	if (req.user.privilege.level == 2)
		bodiesService.find(function (err, items) {
			res.renderState('portals_home', {
				bodies: items,
				user: req.user,
				title: 'Portals Home'
			});
		});
	else if (req.user.privilege.level == 1) {
		res.redirect('/components/portals/' + req.user.privilege.body);
	}
});

var getFields = function (user, orgbody) {
	var fields = [];
	fields.push({
		icon: "name",
		name: "name",
		label: "Name",
		editable: true,
		type: "text",
		required: true,
		value: "",
		typeahead: false,
		none: true,
	});
	fields.push({
		icon: "tagline",
		name: "tagline",
		label: "Tagline",
		editable: true,
		type: "text",
		required: true,
		value: "",
		typeahead: false,
		none: true,
	});
	fields.push({
		icon: "about",
		name: "about",
		label: "Description",
		editable: true,
		type: "textarea",
		required: true,
		value: "",
		typeahead: false,
		none: true,
	});
	fields.push({
		icon: "body",
		name: "body",
		label: "Organiser",
		editable: false,
		type: "text",
		required: true,
		value: orgbody._id,
		typeahead: false,
		none: true,
	});
	fields.push({
		icon: "category",
		name: "category",
		label: "Category",
		editable: true,
		type: "select",
		options: ["Cat1", "Cat2", "Cat3"],
		required: true,
		value: "Cat1",
		typeahead: false,
		none: true,
	});
	fields.push({
		icon: "startTime",
		name: "startTime",
		label: "Start Time",
		editable: true,
		type: "date",
		required: true,
		value: null,
		typeahead: false,
		none: true,
	});
	fields.push({
		icon: "endTime",
		name: "endTime",
		label: "End Time",
		editable: true,
		type: "date",
		required: true,
		value: null,
		typeahead: false,
		none: true,
	});
	return fields;
};

router.get('/:body/events/new', authenticate, elevate, function (req, res, next) {
	if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
		var error = new Error('Access Denied');
		error.status = 403;
		return next(error);
	}
	bodiesService.findOne({
		code: req.params.body
	}, function (err, item) {
		if (err || !item) {
			var error = new Error('Not Found');
			error.status = 404;
			return next(error);
		}
		console.log("Item:", item);
		var params = {
			title: 'Add new event',
			user: req.user,
			body: item,
		};
		params.fields = getFields(req.user, item);
		res.renderState('portals/newevent', params);
	});
});

router.get('/:body', authenticate, elevate, function (req, res, next) {
	if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
		var error = new Error('Access Denied');
		error.status = 403;
		return next(error);
	}
	bodiesService.findOne({
		code: req.params.body
	}, function (err, item) {
		if (err || !item) {
			var error = new Error('Not Found');
			error.status = 404;
			return next(error);
		}
		console.log("Item:", item);
		res.renderState('portal', {
			user: req.user,
			title: item.name,
			fields: [{
					property: "name",
					label: "Name",
					type: "String",
					multiline: false
				},
				{
					property: "description",
					label: "Description",
					type: "String",
					multiline: true
				},
				{
					property: "thumbnail",
					label: "Icon",
					type: "String",
					multiline: false
				}
			],
		});
	});
});

module.exports = router;
