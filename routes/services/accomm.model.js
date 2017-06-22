var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accommSchema = new Schema({
    label: String,
    vacancy: Number,
    filled: Number,
    price: Number   // per day
}, {
    timestamps: true
});

module.exports = {
	route: '/accomm',
	service: mongoose.model('accommModel', accommSchema)
}
