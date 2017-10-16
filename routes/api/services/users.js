var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();
var shortID = require('mongoose-shortid-nodeps');
var eventsModel = require('./events.js').model;

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
	privilege: Schema.Types.Mixed
}, {
	timestamps: true
});

var model = mongoose.model('usersModels', usersSchema);

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
	eventsModel.find({
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

router.get('/notifications', function(req, res, next) {
	res.send(req.user.notifications);
});
router.post('/notifications', function(req, res, next) {
	var list = req.user.notifications;
	list.forEach(function(item){
		item.read = true;
	});
	model.update({
		_id: req.user._id
	}, {
		notifications: list
	}).then(function(){
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
};
