// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   title: String,
//   price: Number,
//   discountPrice: Number,
//   imageUrl: String,
//   quantity: String,
//   sellerName: String,
//   sellerAddress: String,
//   manufactureDate: Date,
//   expiryDate: Date,
//   disclaimer: String,
//   description: String,
//   createdBy: String,
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category"
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("Product", productSchema);


const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  discountPrice: Number,
  imageUrl: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  sellerName: String,
  sellerAddress: String,
  disclaimer: String,
  expiryDate: Date,
  manufactureDate: Date,
  quantity: String,
  description: String,
  createdBy: String // admin email
}, {
  timestamps: true // ✅ So you can sort by "newest first"
});

module.exports = mongoose.model("Product", productSchema);
