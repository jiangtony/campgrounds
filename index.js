var express = require("express"),
		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/campgrounds");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);


// Campground.create(
// {
// 	name: "Salmon Creek",
// 	image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
// 	description: "Lots of salmon",
// })

// var campgrounds = [
// 		{name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
// 		{name: "River Valley", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
// 		{name: "Granite Peak", image: "https://farm2.staticflickr.com/1086/882244782_d067df2717.jpg"},
// 		{name: "Forest Hill", image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg"},
// 		{name: "Goat's Rest", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"}
// ];

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(error);
		} else {
			res.render("index", {campgrounds: allCampgrounds});
		}
	});
});

app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name:name, image:image, description:description};
	
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(error);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
	// find the campground with id in database and render information
	Campground.findByID(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(error);
		} else {
			res.render("show", {campgrounds: foundCampground});
		}
	});
});

app.listen(3000, function() {
	console.log("working");
});