const express=require("express");
const router=express.Router(); 
const User=require("../models/user");
const wrapAsync=require("../utils/wrapasync.js");
const passport= require("passport");
const {saveRedirectUrl}= require("../middleware.js");
const userController=require("../controllers/users.js");


router.route("/signup")
.get(userController.renderSignup)
.post( wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl, passport.authenticate("local",{ failureRedirect: '/login' , failureFlash: true}), userController.login );

router.get("/logout", userController.logout)
module.exports=router;