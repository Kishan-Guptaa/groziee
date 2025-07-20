const fs = require("fs");
const sampleProducts = require("./init/sampleProducts");
const categories = require("./init/categories"); // This should be a separate file with name+slug

// Create a map from category name to slug
const categorySlugMap = {};
categories.forEach(cat => {
  categorySlugMap[cat.name.toLowerCase()] = cat.slug;
});

// Convert products
const updatedProducts = sampleProducts.map(product => {
  const catName = product.category?.toLowerCase();
  const matchedSlug = categorySlugMap[catName];

  if (!matchedSlug) {
    console.warn("⚠️ Category not matched for:", product.title, "=>", product.category);
  }

  return {
    ...product,
    categorySlug: matchedSlug || "unknown-category",
  };
});

// Save to new file
fs.writeFileSync(
  "./init/fixedProducts.js",
  "module.exports = " + JSON.stringify(updatedProducts, null, 2),
  "utf-8"
);

console.log("✅ Converted products saved to init/fixedProducts.js");
