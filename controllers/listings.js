const Listing=require("../models/listings")
const ExpressError=require("../utils/ExpressError.js");
const maptilerClient= require("@maptiler/client");
const mapToken=process.env.MAP_TOKEN;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
maptilerClient.config.fetch = fetch;
maptilerClient.config.apiKey=mapToken;

module.exports.index= async (req,res)=>{
    let query = {};
    if (req.query.category) {
        query.category = req.query.category;
    }
    if (req.query.country) {
        query.country = req.query.country;
    }
    const allListings= await Listing.find(query)
    res.render("listing/index.ejs",{allListings});
};

module.exports.renderNewForm= async (req,res)=>{
    // console.log(req.user); //user related info is stored in the request object
    res.render("listing/new.ejs");
};

module.exports.showListing= async (req,res)=>{
    const {id}=req.params;
    const listing= await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist.");
        res.redirect("/listings"); 
    }
    console.log(listing);
    res.render("listing/show.ejs", {listing});
};

module.exports.editListing= async (req,res)=>{
    const {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist.");
        res.redirect("/listings"); 
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listing/edit.ejs", {listing, originalImageUrl});
};

module.exports.createListing= async(req,res)=>{
    if (!['Trending', 'Mountains', 'Farms', 'Rooms', 'Castles', 'Cities', 'Beach', 'Arctic', 'Camping', 'Amazing Pools'].includes(req.body.listing.category)) {
        throw new ExpressError(400, "Invalid category.");
    }
    
const result = await maptilerClient.geocoding.forward(req.body.listing.location);

       let url=req.file.path;
       let filename=req.file.filename;
      
        let newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        if(!newListing.description){
            throw new ExpressError(400, "Description is required");
        }
        newListing.image= {url, filename};
        newListing.geometry=result.features[0].geometry;
        console.log(newListing);
        let savedListing= await newListing.save();
        console.log(savedListing);
        req.flash("success","New listing created!");
        res.redirect("/listings");
};

module.exports.updateListing= async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data!");
    // }
    const {id}=req.params;
     let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});

     if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url, filename};
        await listing.save();
     }
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing= async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}