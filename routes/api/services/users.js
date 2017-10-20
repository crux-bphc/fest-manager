var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();
var shortID = require('mongoose-shortid-nodeps');
var eventModel = require('./events').model;

var toId = function (str) {
	return mongoose.Types.ObjectId(str);
};

var usersSchema = new Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	profileImage: String,
	institute: {
		type: String
	},
	teams: [shortID],
	referred_by: String,
	events: [Schema.Types.ObjectId],
	accommodation: Number,
	token: String,
	facebookID: String,
	googleID: String,
	githubID: String,
	isAmbassador: {
		type: Boolean,
		default: false
	},
	pending: [Schema.Types.ObjectId],
	notifications: [Schema.Types.Object],
	phone: String,
	address: String,
	pincode: String,
	year: String,
	why: String,
	privilege: Schema.Types.Mixed,
}, {
	timestamps: true
});

var model = mongoose.model('usersModels', usersSchema);

var authenticate = function (req, res, next) { // custom middleware to check if a user
	if (req.isAuthenticated()) // is authenticated in the current session
		return next();
	res.redirect('/components/login');
};

var elevate = function (req, res, next) {
	if (req.user.privilege)
		return next();
	let error = new Error('Access denied');
	error.status = 401;
	return next(error);
};

router.post('/check', function (req, res, next) {
	model.findOne({
			email: req.body.email
		})
		.then(function (user) {
			if (!user) {
				var newuser = new model({
					email: req.body.email,
				});
				console.log(newuser);
				return newuser.save();
			}
			return user;
		})
		.catch(function (err) {
			console.log(err);
		})
		.then(function (user) {
			res.json(user);
		});
});

var addtocart = function (id, userId) {

	var userModel = model;
	var teamModel = require("./teams").model;
	var event_id = mongoose.Types.ObjectId(id);
	var eventTeams, eventTeamSize, eventPrice, userEvents, userTeams, teamId;
	var user;
	return model.findOne({
			_id: userId
		})
		.then(function (result) {
			user = result;
			if (user.events && user.events.indexOf(id) != -1) {
				throw {
					status: 0,
					msg: "Already purchased."
				};
			}
			return eventModel.findOne({
				_id: event_id
			});
		})
		.then(function (event) {
			if (typeof event !== 'undefined') {
				eventTeams = event.teams;
				eventPrice = event.price;
				eventTeamSize = event.teamSize;
				var team = new teamModel({
					name: user.name,
					members: [user._id],
					event: event_id
				});
				return team.save();
			} else throw 'Event Not Found';
		})
		.then(function (team) {
			teamId = team._id;
			var update = {
				$push: {
					teams: team._id,
					events: event_id,
				},
				$pullAll: {
					pending: [event_id],
				}
			};
			return userModel.update({
				_id: userId
			}, update);
		})
		.then(function (num) {
			eventTeams.push(teamId);
			return eventModel.update({
				_id: event_id
			}, {
				teams: eventTeams
			});
		})
		.catch(function (err) {
			if (err.status == 0) console.log(err.msg);
			return err;
		});
};

router.put('/force', authenticate, elevate, function (req, res, next) {
	var changes = {
		name: req.body.user.name,
		institute: req.body.user.institute,
		email: req.body.user.email,
		phone: req.body.user.phone,
		events: req.body.user.events
	};
	var promises = [];
	if (changes.events)
		changes.events.forEach(function (event) {
			promises.push(addtocart(event, req.body.user._id));
		});
	Promise.all(promises)
		.then(function () {
			return model.update({
				_id: req.body.user._id
			}, {
				$set: changes
			});
		})
		.then(function () {
			res.status(200).end("Success");
		})
		.catch(function (err) {
			console.log(err);
			res.status(500).send(err);
		});
});

router.put('/me/', function (req, res, next) {
	var body = req.body;
	var changeddata = {};
	changeddata = Object.assign(req.user, req.body);
	if (req.user._id) {
		model.update({
			email: req.user.email
		}, changeddata, function (err, user) {
			if (err) {
				err.status = 500;
				console.log("User Update Error:", err);
				next(err);
				return 0;
			}
			res.send("Success");
		});
	} else {
		var err = new Error("Forbidden");
		err.status = 403;
		return next(err);
	}
});

router.post('/cart/', function (req, res, next) {
	eventModel.find({
			_id: {
				$in: req.user.pending
			}
		})
		.then(function (events) {
			response = {};
			response.subtotal = 0;
			events.forEach(function (event) {
				response.subtotal += event.price;
			});
			response.total = response.subtotal + parseInt(req.body.amount) || 0;
			response.additional = true;
			if (req.user.accomm) response.additional = false;
			res.json(response);
		})
		.catch(function (err) {
			res.status(500).send(err);
		});
});

router.post('/checkout/', function (req, res, next) {
	console.log('Checking out');
	user = new model(req.user);
	if (req.body.accommodation)
		user.accommodation = req.body.accommodation;
	user.events = user.events.concat(user.pending);
	user.pending = [];
	console.log(user);
	user.save()
		.then(function (user) {
			console.log(user);
			res.status(200).json({
				ok: true,
				user: user
			});
		})
		.catch(function (err) {
			console.log("Error at checkout: ", err);
			res.status(500).send(err);
		});
});

router.get('/notifications', function (req, res, next) {
	res.send(req.user.notifications);
});
router.post('/notifications', function (req, res, next) {
	var list = req.user.notifications;
	list.forEach(function (item) {
		item.read = true;
	});
	model.update({
		_id: req.user._id
	}, {
		notifications: list
	}).then(function () {
		res.json({
			status: 200,
			msg: 'Success',
		});
	});
});
module.exports = {
	route: '/users',
	model: model,
	router: router,
	middleware: {
		authenticate: authenticate,
		elevate: elevate,
	}
};
