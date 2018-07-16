const express = require('express');
const router = express.Router();
const mid = require('../middleware');
const user_controller = require('../controllers/user.controller');



// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// POST /
//This route renders the public profile requested to anyone regardless of login status
router.post('/', user_controller.user_public_view);




//GET  /register
router.get('/register', mid.loggedOut, function(req, res, next){
  return res.render('register', {title: 'Sign Up'});
});

//POST  /register
router.post('/register', user_controller.user_create);



//GET /login
router.get('/login', mid.loggedOut, function(req, res, next){
  return res.render('login', {title: 'Log In'});
});

//POST /login
router.post('/login', mid.loggedOut, user_controller.user_login);


//GET /logout
router.get('/logout', user_controller.user_logout);


//GET /profile
router.get('/profile', mid.requiresLogin, user_controller.user_profile);

//PUT /profile
router.post('/profile', mid.requiresLogin, user_controller.user_update);

//DELETE /delete
router.post('/delete', mid.requiresLogin, user_controller.user_delete);

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});


module.exports = router;
