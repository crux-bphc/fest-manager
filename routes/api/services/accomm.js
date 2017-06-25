var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var accommSchema = new Schema({
	label: String,
	vacancy: Number,
	filled: Number,
	price: Number // per day
}, {
	timestamps: true
});

var model = mongoose.model('accommModel', accommSchema);

module.exports = {
	route: '/accomm',
	model: model,
	router: router,
};
