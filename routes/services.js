var usersModel = require('../models/users.model');
var eventsModel = require('../models/events.model');
var teamsModel = require('../models/teams.model');
var accommModel = require('../models/accomm.model');
var service = require('./service.constructor');

module.exports = {
	users: service(usersModel),
	events: service(eventsModel),
	teams: service(teamsModel),
	accomm: service(accommModel)
}