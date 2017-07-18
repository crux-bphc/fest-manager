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
		fields = [];
		fields.push({
			name: "description",
			placeholder: "Add a description",
			editable: true,
			type: "textarea",
			required: true,
			value: "",
			typeahead: false,
			none: true,
		});
		fields.push({
			name: "hero",
			editable: true,
			type: "image",
			required: true,
			value: "",
			typeahead: false,
			none: true,
			width:800,
			height:400,
			id:1
		});
		fields.push({
			name: "thumbnail",
			editable: true,
			type: "image",
			id:2,
			required: true,
			value: "",
			typeahead: false,
			none: true,
			width: 500,
			height:500
		});
		fields.push({
			name: "type",
			placeholder: "Title",
			editable: true,
			type: "select",
			options: ["Competition", "Workshop", "Proshow"],
			none: true,
			group: 0,
		});
		fields.push({
			name: "title",
			placeholder: "Title",
			editable: true,
			type: "text",
			none: true,
			group: 1,
		});
		fields.push({
			name: "tagline",
			placeholder: "Tagline",
			editable: true,
			type: "text",
			none: true,
			group: 1,
		});
		fields.push({
			name: "category",
			placeholder: "Category",
			editable: true,
			type: "text",
			none: true,
			group: 1,
		});
		fields.push({
			name: "starttime",
			placeholder: "Start Time",
			editable: true,
			type: "text",
			none: true,
			group: 2,
		});
		fields.push({
			name: "endtime",
			placeholder: "End Time",
			editable: true,
			type: "text",
			none: true,
			group: 2,
		});
		fields.push({
			name: "venue",
			placeholder: "Venue",
			editable: true,
			type: "text",
			none: true,
			group: 2,
		});
		fields.push({
			name: "contact",
			placeholder: "Contact",
			editable: true,
			type: "phone",
			none: true,
			group: 2,
		});
		fields.push({
			name: "price",
			placeholder: "Price",
			editable: true,
			type: "number",
			none: true,
			group: 2,
		});
		res.renderState('portal', {
			user: req.user,
			title: item.name,
			fields: fields
		});
	});
});

module.exports = router;
