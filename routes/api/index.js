var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var constructor = fq('service.constructor');
var services = [];

services.push(require('./services/users'));
services.push(require('./services/events'));
services.push(require('./services/teams'));
services.push(require('./services/transactions'));
services.push(require('./services/bodies'));

services.forEach(function (service) {
	router.use(service.route, constructor(service.model, service.router));
});

var typeahead = require('./typeahead');
router.use("/typeahead", typeahead);

module.exports = router;
