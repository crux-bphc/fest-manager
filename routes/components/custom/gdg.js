var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var eventsService = fq("services/events").model;

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'GDG',
		route: 'gdg',
	};
	req.stateparams.immersive = true;
	return req;
};

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = 'GDG';
	req = applyStateChanges(req);
	req.stateparams.subtitle = false;
	eventsService.findOne({
			route: "@gdg"
		})
		.then(function (event) {
			res.renderState('custom/gdg/home', {
				title: 'GDG',
				user: req.user,
				event: event,
			});
		})
		.catch(next);
});


module.exports = router;