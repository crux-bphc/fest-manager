var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamsSchema = new Schema({
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

module.exports = {
	route: '/teams',
	service: mongoose.model('teamsModel', teamsSchema)
};
