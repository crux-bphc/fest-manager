var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var constructor = fq('service.constructor');
var services = [];

services.push(require('./services/users'));
services.push(require('./services/events'));
services.push(require('./services/teams'));
services.push(require('./services/accomm'));
services.push(require('./services/bodies'));
services.push(require('./services/feed'));
services.push(require('./services/news'));
services.push(require('./services/images'));

services.forEach(function (service) {
	router.use(service.route, constructor(service.model, service.router, service.permission));
});

var typeahead = require('./typeahead');
var notify = require('./notify');
var prelims = require('./prelims');
router.use("/typeahead", typeahead);
router.use("/notify", notify);
router.use('/prelims', prelims);

module.exports = router;
