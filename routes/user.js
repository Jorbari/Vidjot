const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require("mongoose");

// load the model
require('../models/user');
const User = mongoose.model('users');

// User login 
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", (req,res,next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res,next);
})

// user registration 
router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }
  if (req.body.password < 4) {
    errors.push({ text: "Password must be greater than 4" });
  }
  if (req.body.name == "") {
    errors.push({ text: "Name cannot be empty" });
  }
  if (req.body.email == "") {
    errors.push({ text: "Please enter an email" });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }); 

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("success_msg", "User already exist");
        res.redirect("/users/register");
      } else {
        bcrypt.genSalt(10, (rr, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You have successfully registered"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });

  }
});


// logout users
router.get('/logout', (req,res) => {
  req.logOut();
  req.flash('success_msg', 'You have successfully logged out');
  res.redirect('/users/login');
})

module.exports = router;
