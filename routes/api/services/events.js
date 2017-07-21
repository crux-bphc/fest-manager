var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var eventsSchema = new Schema({
	name: String,
	tagline: String,
	body: String,
	type: String,
	category: String,
	thumbnail: String,
	hero: String,
	about: String,
	venue: String,
	contact: String,
	startTime: Date,
	endTime: Date,
	teams: [Schema.Types.ObjectId],
	price: Number,
	route: String,
	immersive: String,
	teamSize: Number,
}, {
	timestamps: true
});

var model = mongoose.model('eventsModel', eventsSchema);
var eventModel = model;
var userModel = require("./users").model;
var teamModel = require("./teams").model;

router.post('/addtocart', function (req, res, next) {

	var event_id = mongoose.Types.ObjectId(req.body.id);

	userModel.find({_id: req.user._id, events: {$all: [event_id]}}, function(err, result){
			if(typeof result[0] !== "undefined") {
				return res.json({status: 500, msg: "Event already in cart"});
			}
		eventModel.find({
		_id: event_id
	}, function (err, event) {
		if (err) {
			return res.json({
				status: 500,
				msg: "Error"
			});
		}
		if (typeof event[0] !== 'undefined') {
			var eventTeams = event[0].teams;
			var eventTeamSize = event[0].teamSize;
			var team = new teamModel({
				name: req.user.name,
				members: [req.user._id],
				event: event_id
			});

			team.save(function (err) {
				var team_id = team._id;
				if (err) {
					return res.json({
						status: 500,
						msg: "Unable to save team in DB"
					});
				}

				userModel.find({
					_id: req.user._id
				}, function (err, userDB) {
					var userEvents = userDB[0].events;
					var userTeams = userDB[0].teams;

					userEvents.push(event_id);
					userTeams.push(team_id);

					userModel.update({
						_id: req.user._id
					}, {
						events: userEvents,
						teams: userTeams
					}, function (err, num) {

						if (err) {
							return res.json({
								status: 500,
								msg: "Unable to update user model"
							});
						}

						eventTeams.push(team_id);

						eventModel.update({
							_id: event_id
						}, {
							teams: eventTeams
						}, function (err, num) {
							if (err) {
								return res.json({
									status: 500,
									msg: "Unable to update event model"
								});
							}
							if(eventTeamSize > 1)
							{
								res.json({
									status: 200,
									msg: "Successful",
									teamID: team_id,
									maxTeamSize: eventTeamSize
								});
							}
							else {
								res.json({
									status: 200,
									msg: "Successful",
									maxTeamSize: 1
								});
							}
						});
					});
				});
			});
		} else {
			res.json({
				status: 500,
				msg: "Event Not Found"
			});
		}
	});
	});

	
});

router.post("/jointeam", function(req, res, next){

	var team_id = mongoose.Types.ObjectId(req.body.id);
	var user_id = req.user._id;

	teamModel.find({_id: team_id}, function(err, team){

		if(err)	{
			console.log("ERROR: " + err);
			return res.json({status: 500, msg: "Error finding team"});
		}

		if(typeof team[0] !== 'undefined') {
			var teamMembers = team[0].members;
			var event_id = team[0].event;

			eventModel.find({_id: event_id}, function(err, event){
				if(err) {
					return res.json({status: 500, msg: "Error finding event"});
				}

				if(typeof event[0] !== 'undefined'){
					var team_size = event[0].teamSize;
					if((typeof team_size !== 'undefined') && (teamMembers.length < team_size) && (teamMembers.indexOf(user_id) == -1)){
						
						teamMembers.push(user_id);
						teamModel.update({_id: team_id}, {members: teamMembers}, function(err, num){
							if(err){
								return res.json({status: 500, msg: "Error updating team"});
							}
							userModel.find({_id: user_id}, function(err, user){
								if(err){
									return res.json({status: 500, msg: "Error finding team"});
								}
								var userTeams = user[0].teams;
								var userEvents = user[0].events;
								userTeams.push(team_id);
								userEvents.push(event_id);

								userModel.update({_id: user_id}, {teams: userTeams, events: userEvents}, function(err, num){
									if(err){
										return res.json({status: 500, msg: "Error updating user model"});							
									}
									return res.json({status: 200, msg: "Added to team !"});
								});
							});
						});
					
					} else {
						return res.json({status: 400, msg: "Team full or user already in team"});
					}
				} else {
					return res.json({status: 400, msg: "Event not found !"});
				}
			});
		} else {
			return res.json({status: 400, msg: "Team not found !"});
		}
	});
});

module.exports = {
	route: '/events',
	model: model,
	router: router,
};
