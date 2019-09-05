const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport');
const path = require('path');
const app = express();

const ideas = require('./routes/ideas');
const users = require('./routes/user');

// load the passport
require('./config/passport')(passport);


  
// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// method override middleware
app.use(methodOverride("_method"));
// Express session middle-ware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
app.use(flash());

app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// app.use(express.static('./extensions'));

app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});


app.use('/ideas', ideas);
app.use('/users', users);

const port =  process.env.PORT || 5000;
app.listen(port, () => console.log("node started"));
