var express = require('express');
var router = express.Router();
var service = require('../models/users.model');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var params = {
		title: 'Login to Atmos 2017',
		methods: {
			google: true,
			facebook: true,
			github: false,
		}
	}
    res.render('login', params);
});

module.exports = router;