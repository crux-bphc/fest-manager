var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bodiesSchema = new Schema({
    name: {type: String, required: true}, 
    admin: {type: String, required: true},          // email of admin user
    code: {type: String, required: true}
}, {
    timestamps: true
});

module.exports = {
	route: '/bodies',
	service: mongoose.model('bodiesModel', bodiesSchema)
}