var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var app = express();


//mongodb connection
var db = mongoose.connection;

// Connect to MongoDB and create/use database as configured
db.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`);


//add error handler
db.on('error', console.error.bind(console, 'connection error'));


//use sessions for tracking logins
app.use(session({
  secret: `${config.secret}`,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Import all models
require('./models/user.model.js');

//make userId available to view templates
app.use(function(req, res, next){
  res.locals.currentUser = req.session.userId;
  next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//Listen on configured port
app.listen(config.port, function() {
    console.log(`${config.appName} is listening on port ${config.port}`);
  });
