const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {ensureAuthenticated} = require('../helpers/auth');

require("../models/Idea");
const Idea = mongoose.model("ideas");

mongoose
  .connect("mongodb://localhost/vidjot-dev", { useNewUrlParser: true })
  .then(data => {
    console.log("mongoDB connected");
  })
  .catch(error => {
    console.log("error occured while connecting to mongoDB");
    console.log(error);
  });


router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("ideas/add");
  });
  
  router.get("/edit/:id", (req, res) => {
    Idea.findOne({
      _id: req.params.id
    }).then(idea => {
      res.render("ideas/edit", {
        idea
      });
    });
  });
  
  router.get("/", ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})
      .sort({ date: "desc" })
      .then(Ideas => {
        res.render("ideas/index", {
          Ideas
        });
      });
  });
  
  router.post("/", (req, res) => {
    let errors = [];
    if (!req.body.title) {
      errors.push({ text: "Please add a title" });
    }
    if (!req.body.details) {
      errors.push({ text: "Please add some details" });
    }
    if (errors.length > 0) {
      res.render("ideas/add", {
        errors,
        title: req.body.title,
        details: req.body.details
      });
    } else {
      const newUser = {
        title: req.body.title,
        details: req.body.details,
        user: req.user.id
      };
  
      new Idea(newUser).save().then(idea => {
          // req.flash('success_msg', 'Idea successfully added');
          res.redirect("/ideas");
      });
    }
  });
  
  router.put("/:id", (req, res) => {
    Idea.findOne({
      _id: req.params.id
    }).then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;
  
      idea.save().then(data => {
        res.redirect("/");
      });
    });
  });
  
  router.delete("/:id", (req, res) => {
    Idea.deleteOne({ _id: req.params.id }).then(result => {
      req.flash('success_msg', 'Idea successfully removed');
      res.redirect("/ideas");
    });
  });
  


module.exports = router;