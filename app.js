var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
const keys = require('./config/keys');

//mongoose.connect('mongodb://localhost/login');
mongoose.connect(keys.mongodb.dbURI, ()=>{
  console.log('connected to mongo db');
});
var db = mongoose.connection;
/*var mysql = require('mysql');

//Create connection with mysql

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});*/

var index = require('./routes/index');
var submit= require('./routes/submit');
var register= require('./routes/register');
var dashboard= require('./routes/dashboard');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: false
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
          , root    = namespace.shift()
          , formParam = root;

      while(namespace.length) {
          formParam += '[' + namespace.shift() + ']';
      }
      return {
          param : formParam,
          msg   : msg,
          value : value
      };
  }
}));

// express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// connect flash

app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/submit' , submit);
app.use('/register', register);
app.use('/dashboard', dashboard );

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
  res.render('error');
});

module.exports = app;
