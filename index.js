var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// http://localhost:3000/

var campgrounds = [
		{name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
		{name: "River Valley", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
		{name: "Forest Peak", image: "https://farm2.staticflickr.com/1086/882244782_d067df2717.jpg"},
		{name: "Granite Hill", image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg"},
		{name: "Goat's Rest", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"}
];

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds", function(req, res) {
	res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name:name, image:image};
	campground.push(newCampground);
	res.redirect("/campgrounds");

});

app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

app.listen(3000, function() {
	console.log("working");
});