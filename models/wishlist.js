const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }]
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
