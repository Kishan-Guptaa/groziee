const mongoose = require("mongoose");
const Category = require("../models/category"); // Adjust the path if needed

// MongoDB connection
mongoose.connect("mongodb+srv://kishanguptacode:VYSB3ZMYMJzYabWR@cluster0.pshj1gg.mongodb.net/Groozie", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected ✅");
  renameCategories(); // Call main function
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Main update function
const renameCategories = async () => {
  try {
    const updates = [
      {
        oldName: "Mouth fresheners",
        newName: "Mouth Fresheners",
      },
      {
        oldName: "Toffies And Chocolates",
        newName: "Toffees And Chocolates",
      },
    ];

    for (let { oldName, newName } of updates) {
      const res = await Category.updateOne(
        { name: oldName },
        { $set: { name: newName, slug: slugify(newName) } }
      );

      if (res.matchedCount === 0) {
        console.warn(`❌ No category found for: "${oldName}"`);
      } else {
        console.log(`✅ Renamed "${oldName}" to "${newName}"`);
      }
    }
  } catch (error) {
    console.error("Update error:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Slugify utility
const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
