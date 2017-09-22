var fq = require('fuzzquire');
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
	token: String,
	facebookID: String,
	googleID: String,
	githubID: String,
	isAmbassador: {
		type: Boolean,
		default: false
	},
	pending: [Schema.Types.ObjectId],
	additionals: [Schema.Types.Mixed],
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

var getCart = function (user) {
	return eventsModel.find({
			_id: {
				$in: user.pending
			}
		})
		.then(function (events) {
			cart = {};
			cart.user = user;
			cart.order = [];
			cart.subtotal = 0;
			events.forEach(function (event) {
				cart.order.push({
					id: event._id,
					label: event.name,
					price: event.price,
				});
				cart.subtotal += event.price;
			});
			cart.total = cart.subtotal;
			if (user.additionals)
				user.additionals.forEach(function (addition) {
					if (addition.pending)
						cart.order.push({
							label: addition.label,
							price: addition.price,
						});
				});
			return cart;
		});
};

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
	return new Promise(function (resolve, reject) {
			resolve();
		})
		.then(function () {
			if (req.body.additionals && !req.body.init) {
				return model.update({
					_id: req.user._id,
				}, {
					additionals: req.body.additionals
				});
			}
		})
		.then(function () {
			return getCart(req.user);
		})
		.then(function (response) {
			res.json(response);
		})
		.catch(function (error) {
			res.status(500).send(error);
		});
});

router.post('/checkout/callback', function (req, res, next) {
	console.log('Checked out');
	res.json(req.body);
	// user = new model(req.user);
	// if (req.body.accommodation)
	// 	user.accommodation = req.body.accommodation;
	// user.events = user.events.concat(user.pending);
	// user.pending = [];
	// console.log(user);
	// user.save()
	// 	.then(function (user) {
	// 		console.log(user);
	// 		res.status(200).json({
	// 			ok: true,
	// 			user: user
	// 		});
	// 	})
	// 	.catch(function (err) {
	// 		console.log("Error at checkout: ", err);
	// 		res.status(500).send(err);
	// 	});
});
module.exports = {
	route: '/users',
	model: model,
	router: router,
	getCart: getCart,
};
