var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var config = fq('config-loader'); 

router.get('/', function(req, res, next){
	console.log("*****API");
});

module.exports = router;
