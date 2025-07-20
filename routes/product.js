const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

// GET /product/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).send("Product not found");

    const allCategories = await Category.find();

    res.render("productDetails", { product, allCategories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
