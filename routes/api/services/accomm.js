var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var schema = new Schema({
	label: String,
	vacancy: Number,
	filled: {
		type: Number,
		default: 0
	},
}, {
	timestamps: true
});

schema.plugin(require('mongoose-paginate'));
var model = mongoose.model('accommModel', schema);

module.exports = {
	route: '/accomm',
	model: model,
	router: router,
};
