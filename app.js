
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const pug = require("pug");

// const NodeRsa = require("node-rsa");


const app = express();

app.use(express.static("public"));
app.set("view engine", "pug");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));



app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



app.use("/", require("./routes"));



var User = require("./models/user_account");

var PubKey = require("./models/public_keys");

var SelectedUser = require("./models/users-selected");

var UserMessage = require("./models/users_messages");



app.use(function (req, res) {

    res.status(404).render('404.pug');


});





passport.use(User.createStrategy());




passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/stransfer",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},

    function (accessToken, refreshToken, profile, cb) {
        // console.log(profile.emails[0].value);
        User.findOrCreate({ googleId: profile.id, username: profile.emails[0].value}, function (err, user) {
            return cb(err, user);
        });
    }

));



mongoose.connect("mongodb://localhost:27017/userDB");

// mongoose.connect("mongodb+srv://<username>:<password>@cluster0.jvmiyhv.mongodb.net/?retryWrites=true&w=majority");

// mongoose.connect("mongodb+srv://<username>:<password>@cluster0.jvmiyhv.mongodb.net/userDB");




module.exports = app;








































// app.listen("3000", function () {

//     console.log("listening on http://localhost:3000");
// });
