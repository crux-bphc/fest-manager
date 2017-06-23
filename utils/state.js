

module.exports = function(){
	
	var appendNavbarState = function(state) {
		var navbar = {};
		navbar.logout = state.isAuthenticated;
		navbar.login = !state.isAuthenticated;
		navbar.avatar = state.isAuthenticated;
		state.navbar = navbar;
		return state;
	}

	var appendSidebarState = function(state) {
		var items = ['events', 'carts', 'account', 'settings'];
		var sidebar = {};
		items.forEach(function(elem) {
			if(state.location.startsWith('/'+elem)){
				sidebar[elem] = true;
				if(elem == 'events'){
					// TODO fetch event categories from db to populate
					// sidebar.events.categories = db.events().fetch(categories).unique()
				}
			}
			else {
				sidebar[elem] = false;
			}
		});
		state.sidebar = sidebar;
		return state;
	}

	var getState = function(req) {
		var state = {};
		state.isAuthenticated= req.isAuthenticated();
		state.location= req.url;
		state = appendNavbarState(state);
		state = appendSidebarState(state);
		return state;
	};
	return {
		getState,
	};
}();
