var express = require('express');
var router = express.Router();
var service = require('../models/users.model');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
    service.find(function (err, users) {
    	if(err) { 
    		console.log('0'); return 0;
    	}
    	console.log(users.length);
    })
});

module.exports = router;
