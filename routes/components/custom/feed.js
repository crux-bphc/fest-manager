var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var feedmodel = fq("services/feed").model;

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'News Feed',
		route: 'feed',
	};
	req.stateparams.immersive = false;
	req.stateparams.subtitle = 'News Feed';
	return req;
};

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = 'News Feed';
	req = applyStateChanges(req);
	feedmodel.find({}).then(data => {
		data.sort((a, b) => {
			if (a.createdAt > b.createdAt) {
				return -1;
			}
			if (a.createdAt < b.createdAt) {
				return 1;
			}
			return 0;
		});
		res.renderState('feed', {
			title: "News Feed",
			user: req.user,
			data: data,
		});
	}).catch(err => {
		console.log(err);
		next();
	});
});

module.exports = router;
