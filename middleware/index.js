var Campground = require("../models/campground"),
		Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	}
}

middlewareObj.campgroundAuth = function(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if(err) {
				req.flash("error", "Database error");
				res.redirect("back");
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash("error", "You can only delete campgrounds that you created.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("back");
	}
}

middlewareObj.commentAuth = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err) {
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash("error", "You can only delete campgrounds that you created.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("back");
	}
}

module.exports = middlewareObj;