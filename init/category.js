const mongoose = require("mongoose");
const Category = require("../models/category");

mongoose.connect("mongodb+srv://kishanguptacode:VYSB3ZMYMJzYabWR@cluster0.pshj1gg.mongodb.net/Groozie", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const sampleListings = [
  { name: "Rice, Atta & Dal", description: "Grains, flours, and pulses for daily cooking" },
  { name: "Oil & Ghee", description: "Cooking oils, vanaspati, and pure ghee" },
  { name: "Masala & Spices", description: "Indian spices, blends, and seasonings" },
  { name: "Festive & Gifting", description: "Gifting hampers, sweets, and festive essentials" },
  { name: "Beverages", description: "Juices, soft drinks, tea, coffee, and energy drinks" },
  { name: "Personal Care", description: "Skincare, grooming, hygiene, and wellness products" },
  { name: "Home Essentials & Cleaning", description: "Cleaning products and home utility items" },
  { name: "Pooja Essentials", description: "Pooja samagri, diyas, incense sticks, and more" },
  { name: "Baby & Hygiene", description: "Baby food, diapers, wipes, and hygiene essentials" },
  { name: "Meat & Eggs", description: "Fresh meat, poultry, and eggs" },
  { name: "Pet Supplies", description: "Pet food, toys, grooming, and accessories" },
  { name: "Bakery & Desserts", description: "Cakes, pastries, bread, and sweets" },
  { name: "Sauces & Spreads", description: "Ketchup, mayonnaise, jams, honey, and spreads" },
  { name: "Dry Fruits & Nuts", description: "Almonds, cashews, raisins, dates, and more" },
  { name: "Pickles & Pastes", description: "Traditional pickles and ready-to-cook pastes" },
  { name: "Fruits & Vegetables", description: "Fresh fruits and vegetables sourced daily" },
  { name: "Dairy & Bakery", description: "Milk, cheese, butter, and baked goods" },
  { name: "Snacks & Packaged Food", description: "Chips, namkeen, instant noodles, biscuits" },
  { name: "Mouth fresheners", description: "Saunf, cardamom, pan masala, and more" },
  { name: "Toffies And Chocolates", description: "Candies, chocolates, and sweet treats" }
].map(cat => ({ ...cat, slug: slugify(cat.name) })); // ✅ Add slug to each

const seedCategories = async () => {
  try {
    await Category.deleteMany();
    console.log("Old categories deleted.");

    await Category.insertMany(sampleListings);
    console.log("New categories inserted successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedCategories();
