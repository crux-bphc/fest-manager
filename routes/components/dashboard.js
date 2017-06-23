var express = require('express');
var router = express.Router();
var authenticate = require('../../utils/authentication').middleware;

/* GET users listing. */
router.get('/', authenticate, function(req, res, next) {
    res.renderState('dashboard', { user: req.user });
});

module.exports = router;
