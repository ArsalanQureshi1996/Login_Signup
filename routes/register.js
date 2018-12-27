var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users')

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password= req.body.password;
  var userName= req.body.username;
  //console.log('Testing')

 //Validation
  req.checkBody('email' , 'Email is required').notEmpty();
  req.checkBody('username' , 'userName is required').notEmpty();
  req.checkBody('password' , 'Password is required').notEmpty();
  req.checkBody('password2' , 'Password is required').equals(req.body.password);

  
  

  var error = req.validationErrors();
  User.findOne({email: email}).then((currentUser)=>{
      if(currentUser){
        console.log('You are already a user '+ currentUser);
        res.send('Already a user');
        res.render('register' ,{
          error:error
        });
    }
    else {
        var newUser = new User({
          email: email,
          password:password,
          username:userName
          

        });

        User.createUser(newUser, function(err, user){
         if(err){throw err;}
          else{'User not created'};
          console.log(user);
          req.flash('success_msg', 'You are registered and can now login');
          res.redirect('/')

        });
        
    }
  });
  

});



module.exports = router;