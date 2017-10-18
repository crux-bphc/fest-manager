var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var eventsService = fq("services/events").model;

// Load custom modules here

router.use('/pybits', fq('custom/pybits'));
router.use('/gdg', fq('custom/gdg'));

module.exports = router;
