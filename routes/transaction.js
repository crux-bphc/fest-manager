var express = require('express');
var router = express.Router();
var authenticate = require('../utils/authentication').middleware;

router.post('/', authenticate, function(req, res, next) {
    console.log(req.body);
    return res.json({
        ok: true,
        msg: "Got it."
    })
});
module.exports = router;