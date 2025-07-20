const mongoose = require("mongoose");
const initData = require("./category");
const Listing = require("../models/category");


const MONGO_URL = "mongodb+srv://kishanguptacode:VYSB3ZMYMJzYabWR@cluster0.pshj1gg.mongodb.net/Groozie";
main().then(()=>{
    console.log("connect to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main() {
   mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}
const initdb=async()=>{
    await product.insertMany(productData.data);
    console.log("product was Initialized");
}
initDB();