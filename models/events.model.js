var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var eventsSchema = new Schema({
    name: String,
    department: String,
    thumbnail: String,
    cover: String,
    about: Schema.Types.Mixed,
    contact: [Schema.Types.Mixed],
    startTime: Date,
    endTime: Date,
    teams: [Schema.Types.ObjectId],
    price: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('eventsModel', eventsSchema);
