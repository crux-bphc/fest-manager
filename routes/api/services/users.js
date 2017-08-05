var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();
var shortID = require('mongoose-shortid-nodeps');

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
	events: [Schema.Types.ObjectId],
	accommodation: Schema.Types.ObjectId,
	token: String,
	facebookID: String,
	googleID: String,
	githubID: String,
	isAmbassador: {
		type: Boolean,
		default: false
	},
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
				console.log("Failed at update");
				next(err);
				return 0;
			}
			res.send("Success");
		});
	} else {
		console.log("Forbidden");
		var err = new Error("Forbidden");
		err.status = 403;
		return next(err);
	}
});

module.exports = {
	route: '/users',
	model: model,
	router: router,
};
