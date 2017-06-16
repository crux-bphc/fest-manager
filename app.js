var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var strategies = require('./authentication').strategies;
var cors = require('cors');
var router = require('express').Router();
var configureSerializers = require('./authentication').configureSerializers;
configureSerializers();
strategies.facebook();
strategies.google();

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var registration = require('./routes/registration');
var connection = require('./mongoose');
connection();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// chain all middleware
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('damn ninjas cutting onions'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieSession({
  keys: ['qwerty', 'uiop']
}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true},
    secret: 'damn ninjas cutting onions'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.get('/auth/facebook', 
	passport.authenticate('facebook', 
		{ scope: ['public_profile', 'email'] }, 
		function(req, res) {}
	));

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function(req, res) {
    	res.redirect('/registration');
  	});

app.get('/auth/google', 
	passport.authenticate('google', 
		{ scope: ['https://www.googleapis.com/auth/plus.login','profile', 'email'] }, 
		function(req, res) {}
	));
app.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	function(req, res) {
    	res.redirect('/registration');
  	});
app.use('/registration', registration);
app.use('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
