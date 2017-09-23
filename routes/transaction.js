var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var authenticate = fq('authentication').middleware.authenticate;
var http = require('http');

router.post('/', authenticate, function (req, res, next) {
	res.header('Client', 'Fest-Manager/dash');
	return res.redirect(307, '/api/users/checkout');
});
module.exports = router;
