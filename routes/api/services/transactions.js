var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var transactionsSchema = new Schema({
    user: Schema.Types.ObjectId,
	transaction: Schema.Types.Mixed
}, {
	timestamps: true
});

var model = mongoose.model('transactionsModel', transactionsSchema);

module.exports = {
	route: '/transactions',
	model: model,
	router: router,
};
