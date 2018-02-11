var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var eventsService = fq("services/events").model;

var applyStateChanges = function (req) {
	req.stateparams.immersive = false;
	req.stateparams.forceHideSidebar = true;
	return req;
};

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = 'Till Deaf Do We Part';
	req = applyStateChanges(req);
	res.renderState('custom/prelim', {
		title: 'Terpsichore',
		user: req.user,
		form: fq('forms/tilldeaf'),
		route: '/api/tilldeaf',
	});
});

module.exports = router;
