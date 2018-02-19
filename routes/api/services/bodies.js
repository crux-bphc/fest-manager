var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var schema = new Schema({
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
	route: String,
	portal: {
		type: Schema.Types.Mixed,
		required: false
	}
}, {
	timestamps: true
});

schema.plugin(require('mongoose-paginate'));
var model = mongoose.model('bodies', schema);

var permission = {
	read_one: 0,
	read_all: 0,
	insert: 2,
	update: 2,
	delete: 2
};

module.exports = {
	route: '/bodies',
	model: model,
	router: router,
	permission: permission
};
