const Listing=require("../models/listings");
const Review=require("../models/reviews");

module.exports.createReview= async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview); //user contains info of currently logged user
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
    console.log("new review saved!");
    req.flash("success","New review created!");
    res.redirect(`/listings/${listing._id}`);
 };

 module.exports.destroyReview= async(req,res)=>{
    const {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
 };
