var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var fq = require('fuzzquire');
var strategies = fq('authentication').strategies;
var router = require('express').Router();
var redis = require("redis");
var redisStore = require('connect-redis')(session);
var configureSerializers = fq('authentication').configureSerializers;
configureSerializers();
// Loop over activated authentication strategies
Object.keys(strategies).forEach(strategy => strategies[strategy]());

var connection = fq('mongoose');
connection();

var stateHandler = fq('state');
var optionsHandler = fq('options');

var index = fq('routes');
var upload = fq("routes/upload");
var components = fq('routes/components');
var api = fq('routes/api');
var auth = fq('routes/auth');
var data = fq('routes/export');
var transaction = fq('routes/transaction');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// chain all middleware
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// Set up logger
morgan.token('user', function (req, res) {
	if (req.user) {
		return req.user.email;
	}
	return "Anonymous";
});
morgan.token('date', function () {
	return new Date().toLocaleString("en-US", {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZone: "Asia/Kolkata",
	});
});
app.use(morgan('express: (:date IST) :user \t :method :url :status :response-time ms - :res[content-length]'));

app.use(cookieParser('damn ninjas cutting onions'));
app.use(bodyParser.json({
	limit: "20mb"
}));
app.use(bodyParser.urlencoded({
	limit: "20mb",
	extended: true,
	parameterLimit: 50000
}));
app.use(cookieSession({
	keys: ['qwerty', 'uiop']
}));

app.use(session({
	resave: false,
	saveUninitialized: true,
	store: new redisStore({
		host: 'localhost',
		port: 6379,
		client: redis.createClient(),
		ttl: 260
	}),
	cookie: {
		secure: true
	},
	secret: 'damn ninjas cutting onions'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

let clientCheckpoint = function (req, res, next) {
	if (req.get('Client') === 'Fest-Manager/dash')
		return next();
	else
		res.redirect(req.url);
};

app.use(function (req, res, next) {
	req.stateparams = {};
	res.renderState = function (filename, options) {
		var state = stateHandler.getState(req);
		options = optionsHandler.updateOptions(options);
		res.render(filename, options, function (err, string) {
			if (err) console.log(err);

			res.send({
				html: string,
				state: state,
			});
		});
	};
	return next();
});

app.use('/export', data);
app.use('/upload', upload);
app.use('/auth', auth);
app.use('/transaction', transaction);
app.use('/components', clientCheckpoint, components);
app.use('/api', api);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	if (err.type == "GITHUB_RESOLUTION_ERROR") {
		res.redirect('/login?error=github_email_is_private');
	}
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.renderState('error', {
		user: req.user
	});
});

module.exports = app;
