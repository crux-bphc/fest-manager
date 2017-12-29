var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var eventsService = fq("services/events").model;

// Load custom modules here
var applyStateChanges = function (req) {
    req.stateparams.immersive = true;
    return req;
};
var handler = function(req, res) {
    var Titles = {
        tilldeaf: "Till Deaf Do We Part",
        terpsichore: "Terpsichore",
        kaleidoscope: "Kaleidoscope"
    };
    req = applyStateChanges(req);
    res.renderState('custom/prelim', {
        title: Titles[req.params.id],
        user: req.user,
        form: fq('forms/' + req.params.id)(),
        route: '/api/prelims/' + req.params.id,
    });
}
router.use('/prelims/:id', handler);

module.exports = router;
