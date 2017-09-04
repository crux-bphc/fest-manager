module.exports = function () {

	var appendStateFromRequest = function (state, req) {
		// Append supported variables to state.
		state.location = req.originalUrl;
		state.subtitle = req.stateparams.subtitle || false;
		state.isImmersive = req.stateparams.immersive || false;
		state.pagetitle = req.stateparams.pagetitle || null;
		state.title = req.stateparams.title || {};
		state.submenu = req.stateparams.submenu || {};
		return state;
	};

	var appendUserState = function (state, req) {
		var user = {};
		user.isAuthenticated = req.isAuthenticated();
		if (user.isAuthenticated) {
			user.isElevated = req.user.privilege ? true : false;
			user.privilege = req.user.privilege;
			user.email = req.user.email;
			if (user.githubID) {
				user.avatar = "https://avatars1.githubusercontent.com/u/" + user.githubID;
			}
			if (user.facebookID) {
				user.avatar = "https://graph.facebook.com/v2.9/" + user.facebookID + "/picture?type=large";
			}
			if (req.user.institute && req.user.phone) {
				user.profile = true; //True if profile is complete
			}
		}
		state.user = user;
		return state;
	};

	var appendNavbarState = function (state) {
		var navbar = {};
		navbar.visible = !state.isImmersive;
		navbar.logout = state.user.isAuthenticated;
		navbar.login = !state.user.isAuthenticated;
		navbar.avatar = state.user.isAuthenticated;
		navbar.exit = false;
		state.navbar = navbar;
		return state;
	};

	var appendSidebarState = function (state) {
		var items = ['dashboard', 'portals', 'events', 'home', 'about', 'ca'];
		var sidebar = {};
		sidebar.visible = !state.isImmersive;
		sidebar.menu = {};
		items.forEach(function (elem) {
			if (state.location.startsWith('/components/' + elem)) {
				sidebar.menu[elem] = true;
				if (elem == 'events') {
					// TODO fetch event categories from db to populate
					// sidebar.menu.events.categories = db.events().fetch(categories).unique()
				}
			} else if (state.location == '/components/') {
				sidebar.menu.home = true;
			} else {
				sidebar.menu[elem] = false;
			}
		});
		state.sidebar = sidebar;
		return state;
	};

	var appendTestState = function (state) {
		var test = {};
		test.showportal = state.sidebar.dashboard;
		state.test = test;
		return state;
	};

	var getState = function (req) {
		var state = {};
		state = appendStateFromRequest(state, req);
		state = appendUserState(state, req);
		state = appendNavbarState(state);
		state = appendSidebarState(state);
		// state = appendTestState(state);
		return state;
	};
	return {
		getState,
	};
}();
