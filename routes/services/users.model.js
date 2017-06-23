var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  institute: {
    type: String
  },
  teams: [Schema.Types.ObjectId],
  accommodation: Schema.Types.ObjectId,
  token: String,
  facebookID: String,
  googleID: String,
  githubID: String,
  privilege: Schema.Types.Mixed
}, {
  timestamps: true
});

module.exports = {
  route: '/users',
  service: mongoose.model('usersModel', usersSchema)
};
