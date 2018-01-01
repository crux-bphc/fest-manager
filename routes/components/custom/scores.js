var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var leaderboardmodel = fq("services/leaderboard").model;
var feedmodel = fq("services/feed").model;

var applyStateChanges = function (req) {
	req.stateparams.title = {
		text: 'Scores',
		route: 'scores',
	};
	req.stateparams.immersive = false;
	req.stateparams.subtitle = "PyBITS 2017";
	return req;
};

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = 'Scores';
	req = applyStateChanges(req);
	req.stateparams.subtitle = 'Leaderboard';
	viewdata = {};
	leaderboardmodel.find({})
		.then(data => {
			data.sort((a, b) => {
				if (a.gold.length > b.gold.length) {
					return -1;
				}
				if (a.gold.length < b.gold.length) {
					return 1;
				}
				if (a.silver.length > b.silver.length) {
					return -1;
				}
				if (a.silver.length < b.silver.length) {
					return 1;
				}
				if (a.bronze.length > b.bronze.length) {
					return -1;
				}
				if (a.bronze.length < b.bronze.length) {
					return 1;
				}
				if (a.others.length > b.others.length) {
					return -1;
				}
				if (a.others.length < b.others.length) {
					return 1;
				}
				return 0;
			});
			viewdata.leaderboard = data;
			return feedmodel.find({});
		}).then(data => {
			data.sort((a, b) => {
				if (a.createdAt > b.createdAt) {
					return -1;
				}
				if (a.createdAt < b.createdAt) {
					return 1;
				}
				return 0;
			});
			viewdata.feed = data;
			return Promise.resolve();
		}).then(data => {
			res.renderState('scores', {
				title: "Scores",
				user: req.user,
				data: viewdata,
			});
		})
		.catch(next);
});

module.exports = router;
