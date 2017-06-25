var express = require('express');
var router = express.Router();
var projectroot = require('project-root-path');
var path = require('path');
var fs = require('fs');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

var institutes = {};

fs.readFile(path.join(projectroot, 'utils', 'institutes.json'), (err, data) => {
	if (err) throw err;
	institutes = JSON.parse(data).array;
});

router.get('/institutes', function (req, res, next) {
	res.json([]);
});

router.get('/institutes/:query', function (req, res, next) {
	var query = req.params.query + "";
	var matching = [];
	institutes.forEach(function (elem) {
		if (entities.decode(elem).toLowerCase().startsWith(query.toLowerCase())) {
			matching.push(entities.decode(elem));
		}
	});
	res.json(matching.sort().slice(0, 10));
});

module.exports = router;
