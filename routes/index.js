var express = require('express');
var router = express.Router();
var passport = require('passport');
var fq = require('fuzzquire');
var authenticate = fq('authentication').middleware.authenticate;
var config = fq('config-loader');
var workshops = fq("workshops.js");
var mongoose = require('mongoose');
/* GET home page. */

/*ContrlZ Portal */
var Attendee = fq("models/attendee.js")

function checkAuth(req, res, next) {
	if (!req.session.controlz) {
		res.redirect("/controlz-login");
	} else {
		next()
	}
}

router.get("/controlz-login", (req, res) => {
	return res.render("controlz-login");
})


router.post("/controlz-login", (req, res) => {
	if (req.body.username == "Hajmola2019" && req.body.password == "Hajmola@4245") {
		req.session.controlz = true;
		res.redirect("/controlz")
	} else {
		res.redirect("/controlz-login?invalid-password=true")
	}
})


router.get("/controlz", checkAuth, (req, res) => {
	return res.render("controlz-home", { workshops: workshops, message: req.query.message });
})

router.get("/controlz-logout", checkAuth, async (req, res) => {
	req.session.controlz = false;
	res.redirect("/controlz")
})

router.get("/controlz-statistics", checkAuth, async (req, res) => {
	var stats = [];
	for (var element of workshops) {
		console.log("Will try ", element.name)
		var attendees = await Attendee.find({ workshop: element.name })

		if (attendees.length == 0 || !attendees) {
			continue;
		}
		console.log("For", attendees[0].workshop, attendees.length)
		var onlineCount = 0;
		var offlineCount = 0;
		var totalCount = 0;
		for (var member of attendees) {
			totalCount++
			if (member.online) {
				onlineCount++
			} else {
				offlineCount++
			}
		}

		stats.push(
			{
				workshop: attendees[0].workshop,
				online: onlineCount,
				offline: offlineCount,
				total: totalCount
			}
		)
	}
	console.log("DONE")
	str = "";
	for (elm of stats) {
		str += `<b>${elm.workshop}</b><br>Online Registrations : ${elm.online} <br>Spot Registrations : ${elm.offline}<br>Total : ${elm.total}<hr>`
	}
	stats = "<h4>Raw Statistics </h4> " + str;
	res.redirect(`/controlz?message=${stats}`)
});

router.get("/controlz-reset", checkAuth, (req, res) => {
	res.render("controlz-reset");
}
)

router.get("/controlz-export", checkAuth, (req, res) => {
	Attendee.find((err, attendees) => {
		if (err) {
			res.json(err);
		} else {
			res.json(attendees)
		}
	})
}
)



router.post("/controlz-reset", checkAuth, (req, res) => {
	mongoose.connection.db.dropCollection("attendees", (err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	})
})



router.post("/controlz-registration", checkAuth, (req, res) => {
	var workshop = workshops.find((element) => {
		if (element.name == req.body.workshop) {
			return true;
		}
	})
	var online = (req.body.online == "yes");
	var workshopId = workshop.short + Date.now().toString().substr(-6, 6) + Math.random().toString().substr(-1, 1);
	var comment;
	if (req.body.comment) {
		comment = req.body.comment;
	} else {
		comment = "No comments";
	}
	var newAttendee = new Attendee({
		name: req.body.name,
		mob: req.body.mob,
		workshop: workshop.name,
		online: online,
		controlzId: workshopId,
		townsriptId: req.body.townscriptId,
		comment: comment
	})
	newAttendee.save((err, usr) => {
		if (err) {
			res.json(err)
		} else {
			res.redirect(`/controlz?message=Registered Successfully. ControlZ ID for the attendee is <b>${usr.controlzId}</b>`)
		}
	})
})

router.post("/controlz-verify", (req, res) => {
	Attendee.findOne({ controlzId: req.body.controlzId }, (err, usr) => {
		if (err) {
			res.json(err)
		} else {
			if (!usr) {
				res.redirect("/controlz?message=No such attendee exists.")
			} else {
				console.log("User found", usr)
				var userString = `
				<h4>User Details</h4>
				Name : ${usr.name}<br>
				Online ( From Townscript ) : ${usr.online}<br>
				ControlZ Registration Id : ${usr.controlzId}<br>
				TownScript Reg Id : ${usr.townsriptId}<br>
				Mobile No : ${usr.mob}<br>
				Comments : ${usr.comment}<br>
				`;
				res.redirect(`/controlz?message=${userString}`);
			}
		}
	})
})


router.get('/?*', function (req, res, next) {
	var params = {
		title: 'Home',
		strings: config.strings,
		user: req.user,
		route: req.url,
		navigation: {
			home: {
				label: "Home",
				route: "/",
			},
			// about: {
			// 	label: "About",
			// 	route: "/about",
			// },
			events: {
				label: "Events",
				route: "/events",
			},
			// workshops: {
			// 	label: "Workshops",
			// 	route: "/events#Workshop",
			// },
			dashboard: {
				label: "Dashboard",
				route: "/dashboard",
				initial: "disabled",
				require: {
					path: "user/isAuthenticated",
					for: "visible"
				},
			},
			ca: {
				label: "Campus Ambassador",
				route: "/ca",
			},
			portals: {
				route: "/portals",
				initial: "disabled",
				require: {
					path: "user/isElevated",
					for: "visible"
				},
				label: "Portals"
			}
		}
	};

	Object.keys(params.navigation).forEach(function (key) {
		params.navigation[key].triggers = 'sidebar/menu/' + key + '=active ';
		if (params.navigation[key].require) {
			params.navigation[key].triggers += params.navigation[key].require.path + "=" + params.navigation[key].require.for;
		}
	});

	res.render('index', fq('options').updateOptions(params));
});


module.exports = router;
