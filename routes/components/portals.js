var express = require('express');
var router = express.Router();
var authenticate = require('../../utils/authentication').middleware;
var bodiesService = require('../services/bodies.model').service;

var elevate = function (req, res, next) {
  if (req.user.privilege)
    return next();
  let error = new Error('Access denied');
  error.status = 404;
  next(error);
};

router.get('/', authenticate, elevate, function (req, res, next) {
  if (req.user.privilege.level == 2)
    bodiesService.find(function (err, items) {
      res.renderState('portals_home', {
        bodies: items,
        user: req.user
      });
    });
  else if (req.user.privilege.level == 1) {
    res.redirect('/portals/' + req.user.privilege.body);
  }
});

router.get('/:body', authenticate, elevate, function (req, res, next) {
  if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
    var error = new Error('Access Denied');
    error.status = 403;
    return next(error);
  }
  bodiesService.find({
    code: req.params.body
  }, function (err, item) {
    res.renderState('portal', {
      user: req.user,
      portal: item[0].portal
    });
  });
});

module.exports = router;
