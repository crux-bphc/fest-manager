var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventsSchema = new Schema({
  name: String,
  tagline: String,
  body: Schema.Types.ObjectId,
  category: String,
  thumbnail: String,
  cover: String,
  about: Schema.Types.Mixed,
  contact: [Schema.Types.Mixed],
  startTime: Date,
  endTime: Date,
  teams: [Schema.Types.ObjectId],
  price: Number,
  route: String
}, {
  timestamps: true
});

module.exports = {
  route: '/events',
  service: mongoose.model('eventsModel', eventsSchema)
};
