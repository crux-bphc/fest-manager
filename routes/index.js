var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../utils/authentication').middleware;
/* GET home page. */
router.get('/?*', function(req, res, next) {
    var params = {
        title: 'Home',
        user: req.user,
        route: req.url,
        navigation: {
            home: {
                label: "Home"
            },
            events: {
                label: "Events",
                sub: {
                    comps: { label: "Competitions" },
                    workshops: { label: "Workshops" },
                    shows: { label: "Proshows" }
                }
            },
            dashboard: {
                label: "Dashboard",
                initial: "disabled",
                require: {
                	path: "user/isAuthenticated",
                	for: "visible"
                },
                sub: {
                    account: { label: "Account" },
                    cart: { label: "Cart" },
                    settings: { label: "Settings" }
                }
            },
            portals: {
                initial: "disabled",
                require: {
                	path: "user/isElevated",
                	for: "visible"
                },
                label: "Portals"
            },
            contact: {
                label: "Contact",
                sub: {
                    about: { label: "About Us" },
                    contact: { label: "Get in touch" },
                    reach: { label: "Getting here" }
                }
            }
        }
    };

    Object.keys(params.navigation).forEach(function(key) {
        params.navigation[key].triggers = 'sidebar/' + key + '=active ';
        if(params.navigation[key].require) {
        	params.navigation[key].triggers += params.navigation[key].require.path + "=" + params.navigation[key].require.for;
        }
    });

    res.render('index', params);
});


module.exports = router;
