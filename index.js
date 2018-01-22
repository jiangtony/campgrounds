var express = require("express"),
		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
		Campground = require("./models/campground"),
		Comment = require("./models/comment"),
		seedDB = require("./seeds");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/campgrounds");
seedDB();

app.get("/", function(req, res) {
	res.render("landing");
});

// INDEX route
app.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// CREATE route
app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name:name, image:image, description:description};
	
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// NEW route
app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new");
});

// SHOW route
app.get("/campgrounds/:id", function(req, res) {
	// find the campground with id in database and render information
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

///////////////////////
// COMMENTS routes
///////////////////////
app.get("/campgrounds/:id/comments/new", function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	})
});

app.post("/campgrounds/:id/comments", function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
					res.redirect("/campgrounds");
				} else {
					foundCampground.comments.push(comment._id);
					foundCampground.save();
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});
///////////////////////////
// End of comments routes
///////////////////////////


app.listen(3000, function() {
	console.log("working");
});