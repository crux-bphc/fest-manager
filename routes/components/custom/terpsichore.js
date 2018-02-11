var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var eventsService = fq("services/events").model;

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'Google Developer Group',
		route: 'gdg',
	};
	req.stateparams.immersive = false;
	req.stateparams.forceHideSidebar = true;
	return req;
};

router.get('/', function (req, res, next) {
	req = applyStateChanges(req);
	req.stateparams.subtitle = false;
	eventsService.findOne({
			route: "@gdg"
		})
		.then(function (event) {
			res.renderState('custom/gdg/home', {
				title: 'Google Developer Group',
				user: req.user,
				event: event,
			});
		})
		.catch(next);
});


module.exports = router;
