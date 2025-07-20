const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [cartItemSchema],
  tip: { type: Number, default: 0 },
  deliveryOption: { type: String, default: "Standard" },
  paymentMethod: { type: String, default: "Cash" },
  paymentScreenshot: { type: String, default: "" } // ✅ Added field
});

module.exports = mongoose.model("Cart", cartSchema);
