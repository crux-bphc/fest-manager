const passport = require('passport');
const config = require('./config');
const userService = require('./models/users.model');

var findOrCreate = function(accessToken, profile, provider, done) {
    userService.findOne({
        'email': profile.emails[0].value // email is primary key in usersModel
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            user = new userService({
                name: profile.displayName,
                email: profile.emails[0].value,
                token: accessToken
            });
            user[provider] = profile.id;
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            if (!user[provider]) { //check if same email has connected with a second provider
                user[provider] = profile.id;
                userService.update({ _id: user._id }, user, function(err) {});
            }
            return done(null, user);
        }
    });
}

var configureSerializers = function() { // internal passport configuration to store users in session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
}

var strategies = {
    facebook: function() {
        var FacebookStrategy = require('passport-facebook').Strategy;

        passport.use(new FacebookStrategy(config.facebook,
            function(accessToken, refreshToken, profile, done) {
                findOrCreate(accessToken, profile, 'facebookID', done);
            }
        ));
    },
    google: function() {
        var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

        passport.use(new GoogleStrategy(config.google,
            function(accessToken, refreshToken, profile, done) {
                findOrCreate(accessToken, profile, 'googleID', done);
            }
        ));
    }
}

var authenticate = function(req, res, next) {	// custom middleware to check if a user 
    if (req.isAuthenticated())		            // is authenticated in the current session
        return next();
    res.redirect('/login');
}

module.exports = {
    configureSerializers: configureSerializers,
    strategies: strategies,
    middleware: authenticate
}
