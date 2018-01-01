var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var middleware = fq('authentication').middleware;
var bodiesService = fq('services/bodies').model;
var eventsService = fq('services/events').model;
var userService = fq('services/users').model;

var applyStateChanges = function (req, superuser) {
	req.stateparams.title = req.stateparams.title = {
		text: 'Portals',
		route: '/portals',
	};
	if (superuser)
		req.stateparams.submenu = [{
				route: "/portals/rollout",
				label: "Rollout Notifications",
			},
			{
				route: "/portals/registration",
				label: "Registration",
			},
			{
				route: "/portals/accommodation",
				label: "Accommodation",
			},
			{
				route: "/portals/tickets",
				label: "Tickets",
			},
			{
				route: "/portals/scores",
				label: "Score Update",
			}
		];
	return req;
};

router.get('/', middleware.authenticate, middleware.elevate, function (req, res, next) {
	if (req.user.privilege.level == 2) {
		req = applyStateChanges(req, true);
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
	} else if (req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
		res.redirect('/components/portals/administration');
	}
});

router.get('/rollout', middleware.authenticate, middleware.elevate, function (req, res, next) {
	if (req.user.privilege.level == 2) {
		req = applyStateChanges(req, true);
		res.renderState('portals/rollout', {
			title: "Roll out notifications",
			user: req.user,
			fields: fq('forms/rollout')(),
		});
	} else if (req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
		res.redirect('/components/portals/administration');
	}
});

router.get('/scores', middleware.authenticate, middleware.elevate, function (req, res, next) {
	if (req.user.privilege.level == 2) {
		req = applyStateChanges(req, true);
	} else if (req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
	}
	res.renderState('portals/scores', {
		title: "Scores Home",
		user: req.user,
	});
});

router.get('/scores/leaderboard', middleware.authenticate, middleware.elevate, function (req, res, next) {
	if (req.user.privilege.level == 2) {
		req = applyStateChanges(req, true);
	} else if (req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
	}
	res.renderState('portals/leaderboard', {
		title: "Scores Leaderboard",
		user: req.user,
		fields: fq('forms/leaderboard')(),
	});
});

router.get('/scores/feed', middleware.authenticate, middleware.elevate, function (req, res, next) {
	if (req.user.privilege.level == 2) {
		req = applyStateChanges(req, true);
	} else if (req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
	}
	res.renderState('portals/feed', {
		title: "Scores Feed",
		user: req.user,
		fields: fq('forms/feed')(),
	});
});

router.get('/registration', middleware.authenticate, middleware.elevate, function (req, res, next) {
	if (req.user.privilege.level == 2) {
		req = applyStateChanges(req, true);
	} else if (req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
	}
	res.renderState('portals/registration', {
		title: "Registration",
		user: req.user,
		fields: fq('forms/registration')(),
	});
});

router.get('/tickets', middleware.authenticate, middleware.elevate, function (req, res, next) {
	if (req.user.privilege.level == 2) {
		req = applyStateChanges(req, true);
	} else if (req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
	}
	events = [];
	eventsService.find({
			price: {
				$gt: 0
			}
		})
		.then(function (results) {
			var promises = [];
			results.forEach(function (event) {
				promises.push(userService.find({
						events: event._id
					})
					.then(function (users) {
						events.push({
							name: event.name,
							_id: event._id,
							price: event.price,
							people: users.length,
						});
					}));
			});
			return Promise.all(promises);
		})
		.then(function () {
			var compare = function (a, b) {
				if (a.name > b.name) return -1;
				else return 1;
			};
			res.renderState('portals/tickets', {
				title: "Tickets",
				user: req.user,
				events: events.sort(compare),
			});
		});
});

router.get('/accommodation', middleware.authenticate, middleware.elevate, function (req, res, next) {
	if (req.user.privilege.level == 2) {
		req = applyStateChanges(req, true);
		fq('api/accomm').model.find()
			.then(function (results) {
				res.renderState('portals/accommodation', {
					title: "Accommodation",
					user: req.user,
					addition: {
						fields: fq('forms/accommodation')().addition,
						method: 'POST',
						action: '/portal/accommodation',
					},
					form: {
						fields: fq('forms/accommodation')().allotment,
						method: 'POST',
						action: '/api/users/update-one',
					},
					accomm: results,
				});
			});
	} else if (req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
		res.redirect('/components/portals/administration');
	}
});

router.get('/ca/view', middleware.authenticate, middleware.elevate, function (req, res, next) {

	if (req.user.privilege.body != "ca" && req.user.privilege.level != 2) {
		var error = new Error('Access Denied');
		error.status = 403;
		return next(error);
	}
	req = applyStateChanges(req, true);
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
	req = applyStateChanges(req, true);
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
	req = applyStateChanges(req, true);
	var eventName, event;
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
		.then(function (result) {
			// Block iterates over teams in event and extracts users grouped by their team.
			if (!result) throw new Error("No event found.");
			eventName = result.name;
			event = result;
			var teams = [];
			var userProjection = '_id teams name email institute phone';
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
				event: event,
			});
		})
		.catch(function (err) {
			return res.send("Some error occurred.");
		});
});

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
		res.send("Success");
	});
});

module.exports = router;
