var passport = require('passport');
var credentials = require('./credentials');
var userService = require('./models/users.model');

var configureSerializers = function() {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        userService.findById(id, function(err, user) {
            done(err, user);
        });
    });
}

var strategies = {
    _facebook: function() {
        var FacebookStrategy = require('passport-facebook').Strategy;

        configureSerializers();

        passport.use(new FacebookStrategy(credentials.facebook,
            function(accessToken, refreshToken, profile, done) {
                console.log(profile);
                userService.findOne({
                    'facebookID': profile.id
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        user = new userService({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            facebookID: profile.id
                        });
                        user.save(function(err) {
                            if (err) console.log(err);
                            return done(err, user);
                        });
                    } else {
                        return done(err, user);
                    }
                });
            }
        ));
    },
    _google: function() {
        var GoogleStrategy = require('passport-google').Strategy;

        configureSerializers();
        
        passport.use(new GoogleStrategy(credentials.google,
            function(accessToken, refreshToken, profile, done) {
                console.log(profile);
                userService.findOne({
                    'googleID': profile.id
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        user = new userService({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            googleID: profile.id
                        });
                        user.save(function(err) {
                            if (err) console.log(err);
                            return done(err, user);
                        });
                    } else {
                        return done(err, user);
                    }
                });
            }
        ));
    }
}
module.exports = strategies;
