var express = require("express"),
		router = express.Router({mergeParams: true}),
		Campground = require("../models/campground"),
		Comment = require("../models/comment");

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

///////////////////////
// COMMENTS routes
///////////////////////
router.get("/new", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	})
});

router.post("/", isLoggedIn, function(req, res) {
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
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
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

module.exports = router;