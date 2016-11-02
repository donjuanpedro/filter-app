const http = require('http');
const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('./config/passport');
const flash = require('express-flash');

const routes = require('./routes/index');
const middleware = require('./routes/middleware');
const users = require('./routes/users');
const tweets = require('./routes/tweets');
const usersTweets = require('./routes/users_tweets');

// Set up mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// You need to connect to your MongoDB here
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/filter-app');

const app = express();

app.use(session({
  secret: 'foo',
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/tweets', tweets);
app.use('/users', users);
app.use('/users', usersTweets);
app.get('/protected', middleware.auth, function(req, res, next) {
  return res.json('I am a protected resource!');
});

app.get('*', function(req, res, next) {
  return res.render('index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
