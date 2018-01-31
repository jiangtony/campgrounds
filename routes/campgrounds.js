var express = require("express"),
		router = express.Router(),
		passport = require("passport"),
		Campground = require("../models/campground"),
		User = require("../models/user"),
		middleware = require("../middleware");

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

// NEW route
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// CREATE route
router.post("/", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name, price:price, image:image, description:description, author: author};
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
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

// EDIT route
router.get("/:id/edit", middleware.campgroundAuth, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			res.redirect("/campground");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// UPDATE route
router.put("/:id", middleware.campgroundAuth, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY route
router.delete("/:id", middleware.campgroundAuth, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;