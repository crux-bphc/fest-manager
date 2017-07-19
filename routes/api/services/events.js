var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var eventsSchema = new Schema({
	name: String,
	tagline: String,
	body: Schema.Types.ObjectId,
	type: String,
	category: String,
	thumbnail: String,
	cover: String,
	about: Schema.Types.Mixed,
	contact: [Schema.Types.Mixed],
	startTime: Date,
	endTime: Date,
	teams: [Schema.Types.ObjectId],
	price: Number,
	route: String,
	immersive: String,
}, {
	timestamps: true
});

var model = mongoose.model('eventsModel', eventsSchema);

router.post('/addtocart', function(req, res, next){

		console.log("***POST init****");
		var eventModel = model;
		var userModel = require("./users").model;
		var teamModel = require("./teams").model;

		var event_id = mongoose.Types.ObjectId(req.body.id);


		eventModel.find({

			_id: event_id

		}, function(err, event){

			if(err)
			{
				res.json({status: 500, msg: "Error"});
			}
			if(typeof event[0] !== 'undefined')
			{
				var eventTeams = event[0].teams;
				var team = new teamModel({
					name: req.user.name,
					members: [req.user._id],
					event: event_id
				});

				team.save(function(err){
					var team_id = team._id;
					if(err)
					{
						res.json({status: 500, msg: "Error"});
					}
					else
					{

						userModel.find({_id: req.user._id}, function(err, userDB){

							var userEvents = userDB[0].events;
							var userTeams = userDB[0].teams;

							userEvents.push(event_id);
							userTeams.push(team_id);

							userModel.update({_id: req.user._id}, {events: userEvents, teams: userTeams}, function(err, num){

								if(err)
								{
									res.json({status: 500, msg: "Error"});
								}
								else
								{
									eventTeams.push(team_id);

									eventModel.update({_id: event_id}, {teams: eventTeams}, function(err, num){
										if(err)
										{
											res.json({status: 500, msg: "Error"});
										}
										else
										{
											res.json({status: 200, msg: "Successful"});

										}
									});
								}

							});

						});
					}

				});

			}
			else
			{
				res.json({status: 500, msg: "Error"});
			}
		
		});
	});

module.exports = {
	route: '/events',
	model: model,
	router: router,
};
