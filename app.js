var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var strategies = require('./utils/authentication').strategies;
var router = require('express').Router();
var configureSerializers = require('./utils/authentication').configureSerializers;
configureSerializers();
strategies.facebook();
strategies.google();
strategies.github();

var connection = require('./utils/mongoose');
connection();

var stateHandler = require('./utils/state')

var index = require('./routes/index');
var components = require('./routes/components');
var services = require('./routes/services');
var auth = require('./routes/auth');

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
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieSession({
  keys: ['qwerty', 'uiop']
}));
app.use(session({
  resave: false,
  saveUninitialized: true,
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

app.use(function(req, res, next) {
    var state = stateHandler.getState(req);
    res.renderState = function(filename, options) {
        res.render(filename, options, function(err, string) {
            res.send({html: string, state: state});
        });
    }
    return next();
});

app.use('/auth', auth);
app.use('/components', clientCheckpoint, components);
app.use('/api', clientCheckpoint, services);
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
  res.render('error', {
    user: req.user
  });
});

module.exports = app;
