var User = require('../models/user.model');


//Creates a user in the database
exports.user_create = function (req, res, next){
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
};
//Logs user in to Help!
exports.user_login = function (req, res, next) {
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
};
//Logs user out of Help!
exports.user_logout = function(req, res, next){
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
};
//Displays profile to logged in user
exports.user_profile = function(req, res, next) {
  User.findById(req.session.userId)
    .exec(function(error, user){
      
      if(error){
        return next(error);
      } else {
        return res.render('profile', {title: 'Profile', name: user.name, emergencyContact: user.emergencyContact, emergencyPhone: user.emergencyPhone, allergies: user.allergies});
      }
  });
};
//Displays profile to anyone visiting the site regardless of login status
exports.user_public_view = function(req, res, next) {
  var username = {'name': req.body.name}
    User.findOne(username, function(error, user){
      if(error || !user){
        var err = new Error('User not found.');
        err.status = 401;
        return next(err);
      } else {
        return res.render('publicProfile', {title: 'Profile', name: user.name, emergencyContact: user.emergencyContact, emergencyPhone: user.emergencyPhone, allergies: user.allergies});
      }
    }); 
};

//Updates user info in database
exports.user_update = function(req, res, next) {

  User.findByIdAndUpdate(req.session.userId, req.body, { new: true },
     
    function (err, user) {
      if (err) return next(err);
      res.render('profile', {title: 'Profile', name: user.name, emergencyContact: user.emergencyContact, emergencyPhone: user.emergencyPhone, allergies: user.allergies});
    });

};
//Deletes user from database
exports.user_delete = function(req, res, next) {
  User.findByIdAndRemove(req.session.userId, function (err, user) {
      //delete session object
      req.session.destroy(function(err){
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    })
  });

};