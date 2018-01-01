var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var model = fq("services/leaderboard").model;

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
	model.find({})
		.then(data => {
			data.sort((a,b) => {
				if(a.gold.length > b.gold.length){
					return -1;
				}
				if(a.gold.length < b.gold.length){
					return 1;
				}
				if(a.silver.length > b.silver.length){
					return -1;
				}
				if(a.silver.length < b.silver.length){
					return 1;
				}
				if(a.bronze.length > b.bronze.length){
					return -1;
				}
				if(a.bronze.length < b.bronze.length){
					return 1;
				}
				if(a.others.length > b.others.length){
					return -1;
				}
				if(a.others.length < b.others.length){
					return 1;
				}
				return 0;
			});
			console.log(data);
			res.renderState('scores',{
				title: "Scores",
				user: req.user,
				data: data,
			});
		})
		.catch(next);
});

module.exports = router;
