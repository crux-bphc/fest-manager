var express = require('express');
var router = express.Router();
var fuzzquire = require('fuzzquire');
var eventsService = require('./services/events').model;

router.post('/', function (req, res) {
	var notification = {};
	notification.title = req.body.title;
	notification.message = req.body.message;
	notification.route = req.body.route;
	notification.icon = 'icon-mail_outline';
	if (req.body.type == "Success")
		notification.icon = 'icon-check';
	else if (req.body.type == "Issue")
		notification.icon = 'icon-close';
	var push = fuzzquire('notification').push;
	var mail = fuzzquire('utils/mailer');

	var emailOptions = {};
	emailOptions.subject = req.body.title;
	emailOptions.template = req.body.email;

	if (req.body.to) {
		if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(req.body.to)) {
			// console.log("Matched email");
			push({
				email: req.body.to
			}, notification);
			mail({
				email: req.body.to
			}, emailOptions);
			res.json({
				status: 200,
				msg: "Success",
			});
		} else {
			console.log("Dropped to event type rollout", req.body.to);
			eventsService.findOne({
					route: "japan2"
				})
				.then(function (event) {
					push({
						$or: [{
							events: event._id
						}, {
							pending: event._id
						}]
					}, notification);
					mail({
						events: event._id
					}, emailOptions);
					res.json({
						status: 200,
						msg: "Success",
					});
				})
				.catch(function (err) {
					console.log(err);
				});
		}
	} else {
		push({}, notification);
		mail({}, emailOptions);
		res.json({
			status: 200,
			msg: "Success",
		});
	}
});
module.exports = router;
