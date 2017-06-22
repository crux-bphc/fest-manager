var express = require('express');
var router = express.Router();
var constructor = require('../../service.constructor');
var services = [];

services.push(require('./users.model'));
services.push(require('./events.model'));
services.push(require('./teams.model'));
services.push(require('./accomm.model'));
services.push(require('./bodies.model'));

services.forEach(function(model) {
	router.use(model.route, constructor(model.service));
});

module.exports = router;
