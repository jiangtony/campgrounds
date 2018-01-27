var express = require("express"),
		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
		Campground = require("./models/campground"),
		Comment = require("./models/comment"),
		seedDB = require("./seeds"),
		passport = require("passport"),
		LocalStrategy = require("passport-local"),
		User = require("./models/user"),
		methodOverride = require("method-override");

var campgroundRoutes = require("./routes/campgrounds"),
		commentRoutes = require("./routes/comments"),
		indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/campgrounds");
// seedDB();

// PASSPORT setup
app.use(require("express-session")({
	secret: "raccoons",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);
app.use(indexRoutes);

app.listen(3000, function() {
	console.log("working");
});