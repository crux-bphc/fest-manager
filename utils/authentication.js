const passport = require('passport');
const config = require('./config-loader');
const userService = require('../routes/api/services/users').model;

var findOrCreate = function (accessToken, profile, provider, done) {
	userService.findOne({
		'email': profile.emails[0].value // email is primary key in usersModel
	}, function (err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			user = new userService({
				name: profile.displayName,
				email: profile.emails[0].value,
				token: accessToken,
			});
			if (provider == 'googleID') {
				user.profileImage = profile._json.image.url;
			}
			user[provider] = profile.id;
			user.save(function (err) {
				if (err) console.log(err);
				req.login(user, function() {
					if(err) console.log("Login failed");
					return done(err, user);
				});
			});
		} else {
			if (provider == 'googleID') {
				user.profileImage = profile._json.image.url;
			}
			if (!user[provider] || !user.name) { //check if same email has connected with a second provider
				user[provider] = profile.id;
				user.name = profile.displayName;
				userService.update({
					_id: user._id
				}, user, function (err) {});
			}
			return done(null, user);
		}
	});
};

var configureSerializers = function () { // internal passport configuration to store users in session
	passport.serializeUser(function (user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function (obj, done) {
		userService.findOne({_id: obj}, function(err, user) {
			if(err) console.log("Failed to deserialize");
			done(null, user);
		});
	});
};

var strategies = {
	facebook: function () {
		var FacebookStrategy = require('passport-facebook').Strategy;

		passport.use(new FacebookStrategy(config.facebook,
			function (accessToken, refreshToken, profile, done) {
				findOrCreate(accessToken, profile, 'facebookID', done);
			}
		));
	},
	google: function () {
		var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

		passport.use(new GoogleStrategy(config.google,
			function (accessToken, refreshToken, profile, done) {
				findOrCreate(accessToken, profile, 'googleID', done);
			}
		));
	},
	github: function () {
		var GithubStrategy = require('passport-github').Strategy;

		passport.use(new GithubStrategy(config.github,
			function (accessToken, refreshToken, profile, done) {
				if (!profile.emails) {
					let err = new Error("Your email address is hidden. Go to your account settings to make it public or login using some other provider.");
					err.type = 'GITHUB_RESOLUTION_ERROR';
					return done(err);
				}
				findOrCreate(accessToken, profile, 'githubID', done);
			}
		));
	}
};

var authenticate = function (req, res, next) { // custom middleware to check if a user
	if (req.isAuthenticated()) // is authenticated in the current session
		return next();
	res.redirect('/components/login');
};

module.exports = {
	configureSerializers: configureSerializers,
	strategies: strategies,
	middleware: authenticate
};
