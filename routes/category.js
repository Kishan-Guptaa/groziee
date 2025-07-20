const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');

// Route: /category/:slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).send("Category not found");

    const products = await Product.find({ category: category._id }).sort({ createdAt: -1 });
    const allCategories = await Category.find();

    res.render('categoryProducts', {
      category,
      products,
      allCategories,
      session: req.session  // ✅ Pass session manually
    });


  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
