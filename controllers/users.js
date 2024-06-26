const User=require("../models/user");

module.exports.renderSignup= (req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signup= async (req,res)=>{
    try{
        let {username, email, password}= req.body;
        const newUser=new User({username, email});
        const registeredUser=await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "Welcome!");
            res.redirect("/listings");
        })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin= (req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login= async(req,res)=>{
    req.flash("success","Welcome back, You are logged in!");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout= (req,res,next)=>{
    req.logout((err)=>{
     if(err){
         return next(err);
     }
     req.flash("success","You are logged out now!");
     res.redirect("/listings");
    })
 };