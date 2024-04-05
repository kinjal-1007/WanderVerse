const express=require("express");
const router=express.Router({mergeParams: true}); //important to have full route from app.js
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing= require("../models/listings.js");
const Review= require("../models/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
//Reviews create
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
 //Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports= router;
