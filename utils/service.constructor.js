var express = require('express');

/* routing CRUD operations for users service */
function service(model, router) {
	router.get('/', function (req, res, next) {
		model.find(function (err, items) {
			if (err) {
				err.status = 500;
				next(err);
				return 0;
			}
			res.send(items);
		});
	});

	router.get('/:id', function (req, res, next) {
		model.find({
			_id: req.params.id
		}, function (err, item) {
			if (err) {
				err.status = 404;
				next(err);
				return 0;
			}
			res.send(item);
		});
	});

	router.post('/', function (req, res, next) {
		console.log("*** POST Init ***");
		var item = new model(req.body);
		item.save(function (err) {
			if (err) {
				res.send("Error");
				return 0;
			}
			res.send("Success");
		});
	});

	router.post('/addtocart', function(req, res, next){

		var eventModel = require("../routes/api/services/events").model;
		var userModel = require("../routes/api/services/users").model;
		var teamModel = require("../routes/api/services/teams").model;

		var mongoose = require("mongoose");
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
				var eventTeams = event[0]["teams"];
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

							var userEvents = userDB[0]["events"];
							var userTeams = userDB[0]["teams"];

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
									})
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
		console.log("\n\n");
	});

	router.put('/', function (req, res, next) {
		model.update({
			_id: req.body._id
		}, req.body, function (err) {
			if (err) {
				err.status = 500;
				next(err);
				return 0;
			}
			res.send("Success");
		});
	});

	router.delete('/:id', function (req, res, next) {
		model.findByIdAndRemove(req.params.id, function (err, item) {
			if (err) {
				err.status = 500;
				next(err);
			}
			res.send("Success");
		});
	});
	return router;
}

module.exports = service;
