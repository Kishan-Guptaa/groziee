const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://kishanguptacode:VYSB3ZMYMJzYabWR@cluster0.pshj1gg.mongodb.net/Groozie", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

const sampleProducts = [
  {
    title: "Aashirvaad Atta",
    price: 250,
    discountPrice: 220,
    imageUrl: "/images/aashirvaad.jpg",
    quantity: "5kg",
    sellerName: "Groozie Mart",
    sellerAddress: "Delhi",
    manufactureDate: new Date("2024-04-10"),
    expiryDate: new Date("2025-04-10"),
    disclaimer: "Keep in cool & dry place",
    description: "High-quality whole wheat atta",
    createdBy: "admin@groozie.com",
    categoryName: "Rice, Atta & Dal"
  },
  {
    title: "Fortune Sunflower Oil",
    price: 160,
    discountPrice: 140,
    imageUrl: "/images/fortune-oil.jpg",
    quantity: "1L",
    sellerName: "Groozie Mart",
    sellerAddress: "Delhi",
    manufactureDate: new Date("2024-02-01"),
    expiryDate: new Date("2025-01-31"),
    disclaimer: "Best before 12 months",
    description: "Refined sunflower oil for healthy cooking",
    createdBy: "admin@groozie.com",
    categoryName: "Oil & Ghee"
  }
];

const seedProducts = async () => {
  try {
    for (const product of sampleProducts) {
      const matchedCategory = await Category.findOne({ name: product.categoryName });
      if (!matchedCategory) {
        console.warn(`⚠️ Category not found: ${product.categoryName}`);
        continue;
      }

      const newProduct = new Product({
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        imageUrl: product.imageUrl,
        quantity: product.quantity,
        sellerName: product.sellerName,
        sellerAddress: product.sellerAddress,
        manufactureDate: product.manufactureDate,
        expiryDate: product.expiryDate,
        disclaimer: product.disclaimer,
        description: product.description,
        createdBy: product.createdBy,
        category: matchedCategory._id
      });

      await newProduct.save();
      console.log(`✅ Inserted: ${product.title}`);
    }
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedProducts();
