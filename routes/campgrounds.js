var express = require("express"),
		router = express.Router(),
		passport = require("passport"),
		Campground = require("../models/campground"),
		User = require("../models/user");

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

// INDEX route
router.get("/", function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

// CREATE route
router.post("/", isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name, image:image, description:description, author: author};
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// NEW route
router.get("/new", isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// SHOW route
router.get("/:id", function(req, res) {
	// find the campground with id in database and render information
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

module.exports = router;