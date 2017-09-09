var express = require("express");
var router = express.Router();
var authenticate = require('../utils/authentication').middleware;
var projectroot = require('project-root-path');

var exec = function (script, filename) {
	var exec = require('child_process').exec;
	return function (req, res, next) {
		exec(projectroot + script, function (err, data) {
			res.attachment(filename + '.csv');
			res.end(data, 'UTF-8');
		});
	};
};

var elevate = function (req, res, next) {
	if (req.user.privilege)
		return next();
	let error = new Error('Access denied');
	error.status = 401;
	return next(error);
};

router.get('/users', authenticate, elevate, exec('/tools/export-user-data', 'users'));
router.get('/ca', authenticate, elevate, exec('/tools/export-ca-data', 'campus-ambassadors'));

module.exports = router;
