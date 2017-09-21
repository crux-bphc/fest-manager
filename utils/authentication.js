const passport = require('passport');
const fq = require('fuzzquire');
const config = fq('config-loader');
const userService = fq('services/users').model;

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
				passport.serializeUser(function (user, done) {
					return done(null, user._id);
				});
				var userData = [{
					email: user.email,
					params: {
						title: "Sample Email",
					},
				}];
				var mailOptions = {
					subject: 'Atmos Registration Successful', // Subject line
					template: 'email-templates/test',
				};
				fq('mailer')(userData, mailOptions)
					.catch(err => console.log(err))
					.then(function () {
						done(err, user);
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
		userService.findOne({
			_id: obj
		}, function (err, user) {
			if (err) console.log("Failed to deserialize");
			done(null, user);
		});
	});
};

var strategies = function () {
	var strategies = {};
	if (config.passports.facebook) {
		strategies.facebook = function () {
			var FacebookStrategy = require('passport-facebook').Strategy;

			passport.use(new FacebookStrategy(config.passports.facebook,
				function (accessToken, refreshToken, profile, done) {
					findOrCreate(accessToken, profile, 'facebookID', done);
				}
			));
		};
	}
	if (config.passports.google) {
		strategies.google = function () {
			var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

			passport.use(new GoogleStrategy(config.passports.google,
				function (accessToken, refreshToken, profile, done) {
					findOrCreate(accessToken, profile, 'googleID', done);
				}
			));
		};
	}
	if (config.passports.github) {
		strategies.github = function () {
			var GithubStrategy = require('passport-github').Strategy;

			passport.use(new GithubStrategy(config.passports.github,
				function (accessToken, refreshToken, profile, done) {
					if (!profile.emails) {
						let err = new Error("Your email address is hidden. Go to your account settings to make it public or login using some other provider.");
						err.type = 'GITHUB_RESOLUTION_ERROR';
						return done(err);
					}
					findOrCreate(accessToken, profile, 'githubID', done);
				}
			));
		};
	}
	return strategies;
}();

var authenticate = function (req, res, next) { // custom middleware to check if a user
	if (req.isAuthenticated()) // is authenticated in the current session
		return next();
	res.redirect('/components/login');
};

var elevate = function (req, res, next) {
	if (req.user.privilege)
		return next();
	let error = new Error('Access denied');
	error.status = 401;
	return next(error);
};

module.exports = {
	configureSerializers: configureSerializers,
	strategies: strategies,
	middleware: {
		authenticate: authenticate,
		elevate: elevate,
	},
};
