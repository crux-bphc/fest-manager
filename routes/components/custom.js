var express = require('express');
var router = express.Router();
var eventsService = require("../api/services/events").model;

// Load custom modules here

router.use('/pybits', require('./custom/pybits'));

module.exports = router;
