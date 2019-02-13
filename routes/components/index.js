var express = require('express');
var router = express.Router();
const fq = require('fuzzquire');
const config = fq('config-loader');

router.get('/', function (req, res, next) {
	req.stateparams.pagetitle = config.strings.name;
	req.stateparams.immersive = true;
	res.renderState('home.jade', {
		user: req.user,
		title: 'Home',
		config: config,
	});
});

router.use('/', fq('components/custom'));
let routes = ['events', 'dashboard', 'portals', 'ca', 'about', 'login'];
routes.forEach(elem => {
	router.use(`/${elem}`, fq(`components/${elem}`));
});
router.use('/logout', function (req, res, next) {
	req.logout();
	res.redirect('/components/login');
});
router.use('/404', function (req, res, next) {
	req.stateparams.immersive = true;
	res.renderState('errors/404', {
		user: req.user
	});
});

module.exports = router;
