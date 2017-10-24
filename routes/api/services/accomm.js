var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var accommSchema = new Schema({
	label: String,
	vacancy: Number,
	filled: {
		type: Number,
		default: 0
	},
}, {
	timestamps: true
});

var model = mongoose.model('accommModel', accommSchema);

module.exports = {
	route: '/accomm',
	model: model,
	router: router,
};
