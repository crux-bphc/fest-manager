var express = require('express');
var router = express.Router();
var projectroot = require('project-root-path');
var path = require('path');
var fs = require('fs');

var institutes = {};

fs.readFile(path.join(projectroot, 'utils', 'institutes.json'), (err, data) => {
	if (err) throw err;
	institutes = JSON.parse(data).array;
});

router.get('/', function (req, res, next) {
	res.send("HELLO");
});

router.get('/institutes/:query', function (req, res, next) {
	var query = req.params.query + "";
	var matching = [];
	institutes.forEach(function (elem) {
		if (elem.toLowerCase().indexOf(query.toLowerCase()) != -1) {
			matching.push(elem);
		}
	});
	res.json(matching.sort());
});

module.exports = router;
