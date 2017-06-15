var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authentication').middleware;
/* GET home page. */
router.get('/', authenticate, function(req, res, next) {
    res.render('registration', { title: 'Registration' });
});

module.exports = router;
