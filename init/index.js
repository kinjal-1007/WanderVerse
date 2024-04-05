const mongoose=require("mongoose");
const initData=require("./data");
const Listing= require("../models/listings");

main().then(()=>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, owner: "660c4248331a3db69bad396c"}));
    await Listing.insertMany(initData.data);
    console.log("initialised db");
};

initDB();