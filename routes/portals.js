var express = require('express');
var router = express.Router();
var authenticate = require('../authentication').middleware;
var bodiesService = require('../services/bodies.model').model;

var elevate = function(req, res, next) {
    if (req.user.email.split('@')[1] == "hyderabad.bits-pilani.ac.in")
        return next();
    let error = new Error('Access denied')
    error.status = 404
    next(error);
}

router.get('/', authenticate, elevate, function(req, res, next) {
    if (req.user.privilege.level == 2)
        bodiesService.find(function(err, items) {
            res.render('portals', items);
        });
    else if (req.user.privilege.level == 1) {
        bodiesService.find({ _id: req.user.privilege.body }, function(err, item) {
            res.redirect('/' + req.user.privilege.body)
        })
    }

});

router.get('/:body', authenticate, elevate, function(req, res) {

});

module.exports = router;
