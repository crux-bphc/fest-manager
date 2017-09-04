module.exports = function () {

	var appendUserProfilePic = function (options) {
		if (options.user) {
			if (options.user.googleID) {
				if (options.user.profileImage.endsWith("sz=50")) {
					options.user.profileImage = options.user.profileImage.replace('sz=50', 'sz=500');
				}
			} else if (options.user.facebookID) {
				options.user.profileImage = "https://graph.facebook.com/v2.9/" + options.user.facebookID + "/picture?type=large";
			} else if (options.user.githubID) {
				options.user.profileImage = "https://avatars1.githubusercontent.com/u/" + options.user.githubID;
			} else {
				options.user.profileImage = "https://www.miastograf.pl/bundles/miastografmain/images/avatar.png";
			}
		}
		return options;
	};

	var updateOptions = function (options) {
		options = appendUserProfilePic(options);
		return options;
	};
	return {
		updateOptions,
	};
}();
