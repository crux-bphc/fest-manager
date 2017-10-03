var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var middleware = fq('authentication').middleware;
var bodiesService = fq('services/bodies').model;
var eventsService = fq('services/events').model;
var userService = fq('services/users').model;

var applyStateChanges = function (req) {
	req.stateparams.title = req.stateparams.title = {
		text: 'Portals',
		route: '/portals',
	};
	req.stateparams.submenu = [{
		route: "/portals/dosh",
		label: "Dosh Portal"
	}];
	return req;
};

router.get('/', middleware.authenticate, middleware.elevate, function (req, res, next) {
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


router.get('/dosh', middleware.authenticate, middleware.elevate, function (req, res, next) {
	var params = {
		title: 'Register Newcomer',
		user: req.user,
	};

	req = applyStateChanges(req);
	params.fields = [{
			name: "qr-email",
			placeholder: "Scan User Email",
			editable: true,
			type: "text",
			required: true,
			value: "",
			qrcode: true,
			icon: "qrcode",
			typeahead: false,
		},
		{
			name: "email",
			placeholder: "Enter User Email",
			editable: true,
			type: "text",
			required: true,
			value: "",
			typeahead: 'email',
		}
	];
	res.renderState('portals/doshPortal', params);
});


router.get('/ca/view', middleware.authenticate, middleware.elevate, function (req, res, next) {

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
			return res.renderState('portals/ca', {
				user: req.user,
				items: users,
			});
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/:body', middleware.authenticate, middleware.elevate, function (req, res, next) {
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
			items.sort(function (a, b) {
				if (a.name > b.name) return 1;
				if (a.name < b.name) return -1;
				return 0;
			});
			req.stateparams.pagetitle = body.name;
			return res.renderState('portals/portal', {
				user: req.user,
				body: body,
				items: items,
				fields: fq("new-event")(),
			});
		});
	});
});

router.get('/:body/:eventroute', middleware.authenticate, middleware.elevate, function (req, res, next) {
	if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
		var error = new Error('Access Denied');
		error.status = 403;
		return next(error);
	}
	var eventName;
	bodiesService.findOne({
			code: req.params.body
		})
		.then(function (body) {
			if (!body) throw new Error("No body found.");
			return eventsService.findOne({
				body: body._id,
				route: req.params.eventroute
			});
		})
		.then(function (event) {
			// Block iterates over teams in event and extracts users grouped by their team.
			if (!event) throw new Error("No event found.");
			eventName = event.name;
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

			return Promise.all(promises);
		})
		.then(function (teams) {
			if (!teams) throw new Error("No teams found.");
			req.stateparams.pagetitle = eventName;
			return res.renderState('portals/event', {
				user: req.user,
				title: eventName,
				teams: teams,
				phone: req.user.phone || "NA"
			});
		})
		.catch(function (err) {
			return res.send("Some error occurred.");
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

router.post('/:body/add', middleware.authenticate, middleware.elevate, function (req, res, next) {
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

router.post('/:body/edit', middleware.authenticate, middleware.elevate, function (req, res, next) {
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
