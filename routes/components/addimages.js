var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var middleware = fq("authentication").middleware;
var fields = fq("forms/add-images");

var applyStateChanges = function (req, superuser) {
	req.stateparams.title = {
		text: 'Images',
		route: '/images',
	};
	if (superuser)
		req.stateparams.submenu = [{
				route: "/addimages/new",
				label: "Add new images for an album",
			}
		];
	return req;
};
router.get("/", middleware.authenticate, middleware.elevate, function(req, res, next) {
    if(req.user.privilege.level == 2) {
        req = applyStateChanges(req, true);
        req.stateparams.pagetitle = 'Add Images for Album.';
        res.renderState('add-images/home', {
            user: req.user,
            title: 'Add Images for Album.'
        });
    } else if (req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
		res.redirect('/');
	}
});
router.get("/new", middleware.authenticate, middleware.elevate, function(req, res, next) {
	if(req.user.privilege.level == 2) {
			res.renderState('add-images/album', {
				user:req.user, 
				title: 'Add Images for Album',
				fields: fields
			});
	} else if( req.user.privilege.level == 1) {
		req = applyStateChanges(req, false);
		res.redirect('/');
	}
});
module.exports = router;