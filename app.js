if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const cookieParser=require("cookie-parser")
const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("secretcode"));
const dbUrl=process.env.ATLASDB_URL;

const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },
    touchAfter: 24*3600, 
});
store.on("error",()=>{
   console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main().then(()=>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


// app.get("/", (req,res)=>{
//     console.dir(req.cookies);
//     res.send("I am root");
// })

//cookies
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("madeIn","India");
//     res.send("send you cookies!");
// })
// app.get("/getsignedcookie", (req,res)=>{
//     res.cookie("made-in","India",{signed: true});
//     res.send("sent signed cookie!");
// });
// app.get("/verify", (req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified!");
// })
// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hi!, ${name}`);
// })
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser", async (req,res)=>{
//     let fakeuser=new User ({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser= await User.register(fakeuser, "helloworld"); //2nd argument is password //pbkdf2 hashing algorithm
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
//Reviews route
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req,res,next)=>{
   next(new ExpressError(404, "Page not found!"));
});
//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong"}= err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("listing/error.ejs",{err});
});

app.listen(8080, ()=>{
    console.log("app is listening on port 8080");
})