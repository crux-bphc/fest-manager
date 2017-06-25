var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var bodiesSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	admin: {
		type: String,
		required: true
	}, // email of admin user
	code: {
		type: String,
		required: true
	},
	portal: {
		type: Schema.Types.Mixed,
		required: true
	}
}, {
	timestamps: true
});

var model = mongoose.model('bodiesModel', bodiesSchema);

module.exports = {
	route: '/bodies',
	model: model,
	router: router,
};
