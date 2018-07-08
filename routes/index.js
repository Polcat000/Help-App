var express = require('express');
var router = express.Router();
var User = require('../models/user.model.js');
var mid = require('../middleware');




// GET /
router.get('/', function(req, res, next) {

  return res.render('index', { title: 'Home' });
});

// POST /
router.post('/', function(req, res, next) {

  var username = {
    'name': req.body.name
  }
    User.findOne(username, function(error, user){
      if(error || !user){
        var err = new Error('User not found.');
        err.status = 401;
        return next(err);
      } else {
        return res.render('publicProfile', {title: 'Profile', name: user.name, emergencyContact: user.emergencyContact, emergencyPhone: user.emergencyPhone, allergies: user.allergies});
      }
    }); 
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});


//GET  /register
router.get('/register', mid.loggedOut, function(req, res, next){
  return res.render('register', {title: 'Sign Up'});

});


//POST  /register
router.post('/register', function(req, res, next){
  if (req.body.email &&
      req.body.name &&
      req.body.emergencyContact &&
      req.body.emergencyPhone &&
      req.body.allergies &&
      req.body.password &&
      req.body.confirmPassword) {

        //confirm that user typed the same password twice
        if(req.body.password !== req.body.confirmPassword){
          var err = new Error('Passwords do not match.');
          err.status = 400;
          return next(err);
        }

        //create object with form data
        var userData = {
          email: req.body.email,
          name: req.body.name,
          emergencyContact: req.body.emergencyContact,
          emergencyPhone: req.body.emergencyPhone,
          allergies: req.body.allergies,
          password: req.body.password
        };

        //use schema's create() method to insert document into mongo
        User.create(userData, function(error, user){
          if(error){
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('/profile');
          }
        });

      } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }
});



//GET /login
router.get('/login', mid.loggedOut, function(req, res, next){
  return res.render('login', {title: 'Log In'});
});

//POST /login
router.post('/login', function(req, res, next){
  if (req.body.email && req.body.password){
    User.authenticate(req.body.email, req.body.password, function(error, user){
      if(error || !user){
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  }else{
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

//GET /logout
router.get('/logout', function(req, res, next){
  if(req.session){
    //delete session object
    req.session.destroy(function(err){
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    })
  }
})

//GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next){
  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        return next(error);
      } else {
        return res.render('profile', {title: 'Profile', name: user.name, emergencyContact: user.emergencyContact, emergencyPhone: user.emergencyPhone, allergies: user.allergies});
      }
  });
});


module.exports = router;
