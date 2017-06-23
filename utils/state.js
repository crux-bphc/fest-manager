module.exports = function () {

	var appendUserState = function (state, req){
		var user = {};
		user.isAuthenticated = req.isAuthenticated();
		if(user.isAuthenticated) {
			user.isElevated = req.user.privilege?true:false;
			user.privilege = req.user.privilege;
			user.email = req.user.email;
			if(user.githubID){
				user.avatar = "https://avatars1.githubusercontent.com/u/" + user.githubID;
			}
			if(user.facebookID){
				user.avatar = "https://graph.facebook.com/v2.9/" + user.facebookID + "/picture?type=large";
			}
		}
		state.user = user;
		return state;
	};

	var appendNavbarState = function (state) {
		var navbar = {};
		navbar.logout = state.user.isAuthenticated;
		navbar.login = !state.user.isAuthenticated;
		navbar.avatar = state.user.isAuthenticated;
		state.navbar = navbar;
		return state;
	};

	var appendTestState = function (state) {
		var test = {};
		test.showportal = state.sidebar.dashboard;
		state.test = test;
		return state;
	};

	var appendSidebarState = function (state) {
		var items = ['dashboard', 'portals', 'events', 'carts', 'account', 'settings'];
		var sidebar = {};
		items.forEach(function (elem) {
			if (state.location.startsWith('/components/' + elem)) {
				sidebar[elem] = true;
				if (elem == 'events') {
					// TODO fetch event categories from db to populate
					// sidebar.events.categories = db.events().fetch(categories).unique()
				}
			} else {
				sidebar[elem] = false;
			}
		});
		state.sidebar = sidebar;
		return state;
	};

	var getState = function (req) {
		var state = {};
		state.location = req.url;
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
