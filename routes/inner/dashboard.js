var express = require('express');
var router = express.Router();
var authenticate = require('../../authentication').middleware;

/* GET users listing. */
router.get('/', authenticate, function(req, res, next) {
    res.render('dashboard', {user: req.user});
});

module.exports = router;
