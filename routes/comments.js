var express = require("express"),
		router = express.Router({mergeParams: true}),
		Campground = require("../models/campground"),
		Comment = require("../models/comment"),
		middleware = require("../middleware");

///////////////////////
// COMMENTS routes
///////////////////////

// NEW route
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	})
});

// CREATE route
router.post("/", middleware.isLoggedIn, function(req, res) {
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

// EDIT route
router.get("/:comment_id/edit", middleware.commentAuth, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})
});

// UPDATE route
router.put("/:comment_id", middleware.commentAuth, function(req,res) {
	Comment.findByIdAndUpdate("req.params.comment_id", req.body.comment, function(err, updatedComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


// DESTROY route
router.delete("/:comment_id", middleware.commentAuth, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

///////////////////////////
// End of comments routes
///////////////////////////

module.exports = router;