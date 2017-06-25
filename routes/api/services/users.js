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
	facebookID: String,
	googleID: String,
	githubID: String,
	privilege: Schema.Types.Mixed
}, {
	timestamps: true
});

var model = mongoose.model('usersModels', usersSchema);

router.put('/me/', function (req, res, next) {
	console.log(req.user);
	var body = req.body;
	var changeddata = {};
	console.log(body);
	if (body.name) changeddata.name = body.name;
	if (body.institute) changeddata.institute = body.institute;
	console.log("Update Data:", changeddata);
	if (req.user._id) {
		model.update({
			_id: req.user._id
		}, changeddata, function (err) {
			if (err) {
				err.status = 500;
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

module.exports = {
	route: '/users',
	model: model,
	router: router,
};
