const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  slug: { type: String, required: true, unique: true }, // ✅ Add this line
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
