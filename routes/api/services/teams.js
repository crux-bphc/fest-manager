var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();
var shortID = require('mongoose-shortid-nodeps');

var schema = new Schema({
	_id: {
		type: shortID,
		len: 7,
		alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		retries: 500
	},
	name: String,
	members: [Schema.Types.ObjectId],
	event: Schema.Types.ObjectId,
	position: {
		type: String,
		enum: [1, 2, 3, -1],
		default: -1
	}
}, {
	timestamps: true
});

schema.plugin(require('mongoose-paginate'));
var model = mongoose.model('teams', schema);

module.exports = {
	route: '/teams',
	model: model,
	router: router,
};
