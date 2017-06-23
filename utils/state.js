module.exports = function(){
	
	var appendNavBarStates = function(state) {
		var navbar = {}
		navbar.logout = state.isAuthenticated;
		navbar.login = !state.isAuthenticated;
		navbar.avatar = state.isAuthenticated;
		state.navbar = navbar;
		return state;
	}

	var getState = function(req) {
		var state = {};
		state.isAuthenticated= req.isAuthenticated();
        state.location= req.url;
        
        state = appendNavBarStates(state);
        
        return state
	};
	return {
		getState,
	};
}();
