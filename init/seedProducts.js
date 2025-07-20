const mongoose = require("mongoose");
const Product = require("../models/product"); // adjust path if needed
const Category = require("../models/category"); // adjust path if needed
const sampleProducts = require("./sampleProducts");
// const sampleProducts = require("./fixCategorySlug.js"); // ✅ Use the updated one

// MongoDB connection
mongoose.connect("mongodb+srv://kishanguptacode:VYSB3ZMYMJzYabWR@cluster0.pshj1gg.mongodb.net/Groozie", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

async function seedDB() {
  try {
    await Product.deleteMany(); // Clear old products (optional)
    console.log("Old products deleted");

    for (let product of sampleProducts) {
      const foundCategory = await Category.findOne({ slug: product.categorySlug });

      if (!foundCategory) {
        console.log(`❌ Category not found: ${product.category}`);
        continue;
      }
      product.category = foundCategory._id;
      await Product.create(product);
      console.log(`✅ Inserted: ${product.title}`);
    }

    console.log("✅ All products seeded successfully!");
  } catch (err) {
    console.error("Error inserting products:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
