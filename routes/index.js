var express = require("express"),
		router = express.Router(),
		passport = require("passport"),
		User = require("../models/user");

// Root route
router.get("/", function(req, res) {
	res.render("landing");
});

///////////////////////////
// AUTHENTICATION routes
///////////////////////////

// Register
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/campgrounds");
		});
	});
});

// Log in
router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {

});

// Log out
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
});

module.exports = router;