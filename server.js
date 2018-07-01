
// const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const session = require('express-session');
const router = require('./routes');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
// const publicPath = path.resolve(__dirname, './public');
const app = express();


//mongodb connection
var db = mongoose.connection;

// Connect to MongoDB database as configured
mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`);

//add error handler
db.on('error', console.error.bind(console, 'connection error'));

// include routes
app.use('/', router);

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
// app.use('/api', router);

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');



//use sessions for tracking logins
app.use(session({
    secret: `${config.secret}`,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
}));
  

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

app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});
