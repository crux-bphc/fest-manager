var express = require('express');
var router = express.Router();
var projectroot = require('project-root-path');
var path = require('path');
var fs = require('fs');
var Fuse = require('fuse.js');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

var institutes = {};

var fuzzItUp = function (data, input) {
	var options = {
		// shouldSort: true, // This causes less weighted results to come on top.
		findAllMatches: true,
		// includeMatches: true, // TODO Use this to make smart-fuzz-plugin
		threshold: 0.9,
		location: 0,
		distance: 300,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: undefined,
	};
	var fuse = new Fuse(data, options);
	var results = fuse.search(input);
	var rval = [];
	results.forEach(function (elem) {
		rval.push(data[elem]);
	});
	return rval;
};

fs.readFile(path.join(projectroot, 'utils', 'institutes.json'), (err, data) => {
	if (err) throw err;
	institutes = JSON.parse(data).array;
});

router.get('/institutes', function (req, res, next) {
	res.json(["None", "Birla Institute of Technology & Science - Hyderabad"]);
});

router.get('/institutes/:query', function (req, res, next) {
	var query = req.params.query + "";
	var matching = fuzzItUp(institutes, query);
	var reex = /\{(.*?)\}/gi;
	res.json(matching
		.slice(0, 10)
		.sort()
		.map(function (elem) {
			return elem.replace(reex, '');
		}));
});

module.exports = router;
