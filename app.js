var createError = require('http-errors');
var express = require('express');
const methodOverride =require( 'method-override');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminsRouter = require('./routes/admins');
var admins2Router = require('./routes/admins2');
var tecBioqRouter = require('./routes/tecbioq');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'PrrTutuPrrTutu',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
//para pasar los roles al front siempre
app.use((req, res, next) => {
  res.locals.roles = req.session.roles || [];
  next();
});


// -------------------------------------------RUTAS
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admins', adminsRouter);
app.use(`/admins2`, admins2Router);
app.use('/tecBioq', tecBioqRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { msg: err.message, codigo: err.status });
});

module.exports = app;
