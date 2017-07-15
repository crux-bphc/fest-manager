		var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var usersSchema = new Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	institute: {
		type: String
	},
	teams: [Schema.Types.ObjectId],
	events: [Schema.Types.ObjectId],
	accommodation: Schema.Types.ObjectId,
	token: String,
	qrData: String,
	facebookID: String,
	googleID: String,
	githubID: String,
	privilege: Schema.Types.Mixed
}, {
	timestamps: true
});

var model = mongoose.model('usersModels', usersSchema);

router.put('/me/', function (req, res, next) {
	var body = req.body;
	var changeddata = {};
	if (body.name) changeddata.name = body.name;
	if (body.institute) changeddata.institute = body.institute;
	changeddata = Object.assign(req.user, changeddata);
	if (req.user._id) {
		model.update({
			email: req.user.email
		}, changeddata, function (err, user) {
			if (err) {
				err.status = 500;
				next(err);
				return 0;
			}
			req.login(changeddata, function (err) {
				if (err) {
					err.status = 500;
					next(err);
					return 0;
				}
				res.send("Success");
			});
		});
	} else {
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
