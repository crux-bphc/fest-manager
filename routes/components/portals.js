var express = require('express');
var router = express.Router();
var authenticate = require('../../utils/authentication').middleware;
var bodiesService = require('../api/services/bodies').model;
var eventsService = require('../api/services/events').model;
var userService = require('../api/services/users').model;
var elevate = function (req, res, next) {
	if (req.user.privilege)
		return next();
	let error = new Error('Access denied');
	error.status = 404;
	return next(error);
};

var applyStateChanges = function (req) {
	req.stateparams.title = req.stateparams.title = {
		text: 'Portals',
		route: '/portals',
	};
	req.stateparams.submenu = [{
			route: "/portals/dosh",
			label: "Dosh Portal"
		}
	];
	return req;
};

router.get('/', authenticate, elevate, function (req, res, next) {
	req = applyStateChanges(req);
	if (req.user.privilege.level == 2)
		bodiesService.find(function (err, items) {
			if (err) {
				return next(err);
			}
			req.stateparams.pagetitle = 'Portals';
			res.renderState('portals/home', {
				bodies: items,
				user: req.user,
				title: 'Portals Home'
			});
		});
	else if (req.user.privilege.level == 1) {
		res.redirect('/components/portals/' + (req.user.privilege.body == "ca" ? 'ca/view' : req.user.privilege.body));
	}
});


router.get('/dosh', authenticate, elevate, function (req, res, next) {
	var params = {
		title: 'Register Newcomer',
		user: req.user,
	};

	req = applyStateChanges(req);
	params.fields = getFields(req.user);
	res.renderState('portals/doshPortal', params);
});


router.get('/ca/view', authenticate, elevate, function (req, res, next) {

	if (req.user.privilege.body != "ca" && req.user.privilege.level != 2) {
		var error = new Error('Access Denied');
		error.status = 403;
		return next(error);
	}

	userService.find({
			isAmbassador: true
		}, '_id name email institute phone address pincode why')
		.then(function (users) {
			req.stateparams.title = "Campus Ambassador";
			console.log('users.length:', users.length);
			return res.renderState('portals/ca', {
				user: req.user,
				items: users,
			});
		})
		.catch(function (err) {
			console.log(err);
			return next(err);
		});
});

var getFields = function (event) {
	fields = [];
	fields.push({
		name: "description",
		placeholder: "Add a description",
		editable: true,
		type: "textarea",
		required: true,
		rows: 8,
		value: event ? event.description : "",
		typeahead: false,
		none: true,
	});
	fields.push({
		name: "hero",
		editable: true,
		type: "image",
		required: true,
		value: event ? event.hero : "",
		typeahead: false,
		none: true,
		width: 800,
		height: 400,
		id: 1
	});
	fields.push({
		name: "thumbnail",
		editable: true,
		type: "image",
		id: 0,
		required: true,
		value: event ? event.thumbnail : "",
		typeahead: false,
		none: true,
		width: 500,
		height: 500
	});
	fields.push({
		name: "type",
		placeholder: "Type",
		editable: true,
		value: event ? event.type : "",
		type: "select",
		options: ["Headliner", "Competition", "Workshop", "Proshow"],
		none: true,
		group: 0,
	});
	fields.push({
		name: "title",
		placeholder: "Title",
		editable: true,
		value: event ? event.title : "",
		type: "text",
		none: true,
		group: 1,
	});
	fields.push({
		name: "tagline",
		placeholder: "Tagline",
		editable: true,
		value: event ? event.tagline : "",
		type: "text",
		none: true,
		group: 1,
	});
	fields.push({
		name: "category",
		placeholder: "Category",
		editable: true,
		type: "text",
		value: event ? event.category : "",
		none: true,
		group: 1,
	});
	fields.push({
		name: "venue",
		placeholder: "Venue",
		editable: true,
		type: "text",
		value: event ? event.venue : "",
		none: true,
		group: 2,
	});
	fields.push({
		name: "contact",
		placeholder: "Contact",
		editable: true,
		type: "phone",
		value: event ? event.contact : "",
		none: true,
		group: 2,
	});
	fields.push({
		name: "price",
		placeholder: "Price",
		editable: true,
		value: event ? event.price : "",
		type: "number",
		none: true,
		group: 2,
	});
	fields.push({
		name: "route",
		placeholder: "Route",
		editable: true,
		value: event ? event.route : "",
		type: "text",
		none: true,
		group: 2,
	});
	fields.push({
		name: "teamSize",
		placeholder: "Team Size",
		editable: true,
		value: event ? event.teamSize : "",
		type: "number",
		none: true,
		group: 2,
	});
	fields.push({
		name: "starttime",
		placeholder: "Start Time",
		editable: true,
		value: event ? event.startTime : "",
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
		value: event ? event.endTime : "",
		group: 2,
	});
	return fields;
};

router.get('/:body', authenticate, elevate, function (req, res, next) {


	if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
		var error = new Error('Access Denied');
		error.status = 403;
		return next(error);
	}

	var name;
	bodiesService.findOne({
		code: req.params.body
	}, function (err, body) {
		if (err || !body) return res.send("Error");
		eventsService.find({
			body: body._id
		}, function (err, items) {
			if (err || !items) {
				var error = new Error('Not Found');
				error.status = 404;
				return next(error);
			}
			req.stateparams.pagetitle = body.name;
			return res.renderState('portals/portal', {
				user: req.user,
				body: body,
				items: items,
				fields: getFields(),
			});
		});
	});
});

router.get('/:body/:eventroute', authenticate, elevate, function (req, res, next) {
	if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
		var error = new Error('Access Denied');
		error.status = 403;
		return next(error);
	}
	var name;
	bodiesService.findOne({
		code: req.params.body
	}, function (err, body) {
		if (err || !body) return res.send("Error");
		eventsService.findOne({
			body: body._id,
			route: req.params.eventroute
		}, function (err, event) {
			if (err || !event) {
				var error = new Error('Not Found');
				error.status = 404;
				return next(error);
			}

			// Block iterates over teams in event and extracts users grouped by their team.
			var teams = [];
			var userProjection = '_id teams name email institute';
			var _query = function (team) {
				return userService.find({
					teams: team
				}, userProjection);
			};

			// Returns an array of promises to pass to Promise.all to resolve when all are done.
			var promises = event.teams.map(function (team) {
				return _query(team);
			});

			Promise.all(promises)
				.then(function (values) {
					teams = values;
					req.stateparams.pagetitle = event.name;

					return res.renderState('portals/event', {
						user: req.user,
						title: event.name,
						teams: teams,
					});
				})
				.catch(function (err) {
					console.log(err);
					return res.send("Some error occurred.");
				});
		});
	});
});

function generate_pdf(event) {
	var pdf = require('html-pdf');
	var fs = require('fs');
	var path = require('path');
	var marked = require('marked');

	var template = fs.readFileSync(path.join(__dirname, '../../utils/letterhead.html')).toString();
	var filename = path.join(__dirname, '../../public/static/data/docs/' + event.name + '.pdf');

	template = template.replace('$$--title--$$', event.name).replace('$$--content--$$', marked(event.about));
	pdf.create(template).toStream(function (err, stream) {
		stream.pipe(fs.createWriteStream(filename));
	});
}

router.post('/:body/add', authenticate, elevate, function (req, res, next) {
	if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
		var error = new Error('Access Denied');
		error.status = 403;
		return next(error);
	}
	var event = new eventsService(req.body);
	bodiesService.findOne({
		code: req.params.body
	}, function (err, body) {
		event.body = body._id;
		event.save(function (err) {
			if (err) return res.send("Error");
			generate_pdf(event);
			res.send("Success");
		});
	});
});

router.post('/:body/edit', authenticate, elevate, function (req, res, next) {
	if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
		var error = new Error('Access Denied');
		error.status = 403;
		return next(error);
	}
	eventsService.update({
		_id: req.body._id || req.body.id
	}, req.body, function (err) {
		if (err) return res.send("Error");
		generate_pdf(req.body);
		res.send("Success");
	});
});

module.exports = router;
