var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


//post request
router.post('/' , function(req,res,next){
  console.log("Inside post route")
  var email = req.body.email;
  var password = req.body.password;

  /*test function

  User.findOne({username: username, password: password}, function(err, user){
    if(err) throw err;
  });


  test function ends*/

  req.checkBody('email' , 'Email is required').notEmpty();
  req.checkBody('password' , 'Password is required').notEmpty();

  var error = req.validationErrors();
  if(error){
      req.flash('error_msg','Something is incorrect');
      console.log(error);
  }
  else {
    //console.log("Inside else block")
    passport.use(new LocalStrategy(
      function(email, password, done) {
        console.log("Inside local strategy");
        console.log(email);
        User.getUserByUsername(email, function(err,user){
          if(err) throw err;
          //console.log(email, password);
          if(!user){
            return done(null, false, {message: 'Unknown User'});
            //console.log(email, password);
          }
          
          User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
              return done(null, user);
            } else{
              return done(null, false, {message: 'Invalid password'});
              //console.log(email, password);
              //console.log('\\\\');
            }
          });
        });
    
      }));

      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
          done(err, user);
        });
      });
   }

});

router.post('/login',
  passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect: '/', failureFlash: true}),
  function(req, res) {
    res.redirect('/dashboard');
  });

module.exports = router;
