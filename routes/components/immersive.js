var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	res.renderState('immersive', {
		user: req.user
	});
});

module.exports = router;
