const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const Product = require('../models/product');
const Category = require('../models/category');
const Cart = require('../models/cart');  // ✅ Import Cart model

// ✅ Middleware to check admin login
function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect('/admin/login');
}

// ✅ GET: Admin signup page
router.get('/signup', (req, res) => {
  res.render('adminSignup');
});

// ✅ POST: Admin signup logic
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.send('Admin already exists. Please login.');

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hashedPassword });

    res.redirect('/admin/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Admin signup failed.');
  }
});

// ✅ GET: Admin login page
router.get('/login', (req, res) => {
  res.render('adminLogin');
});

// ✅ POST: Admin login logic
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) return res.send('Admin not found');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (isMatch) {
    req.session.admin = {
      id: admin._id,
      email: admin.email
    };
    res.redirect('/admin/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

// ✅ GET: Admin dashboard (protected)
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const email = req.session.admin.email;

    const products = await Product.find({ createdBy: email }).populate('category');

    // ✅ Get all carts (to check payment screenshots)
    const carts = await Cart.find({}).populate('items.product');

    res.render('adminDashboard', {
      email,
      products,
      carts
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Failed to load dashboard.");
  }
});

// ✅ GET: Add product form (protected)
router.get('/add-product', isAdmin, async (req, res) => {
  const categories = await Category.find();
  res.render('adminAddProduct', { categories });
});

// ✅ POST: Add product logic (protected)
router.post('/add-product', isAdmin, async (req, res) => {
  try {
    const {
      title,
      price,
      discountPrice,
      category,
      imageUrl,
      sellerName,
      sellerAddress,
      disclaimer,
      expiryDate,
      manufactureDate,
      quantity,
      description
    } = req.body;

    await Product.create({
      title,
      price,
      discountPrice,
      category,
      imageUrl,
      sellerName,
      sellerAddress,
      disclaimer,
      expiryDate,
      manufactureDate,
      quantity,
      description,
      createdBy: req.session.admin.email
    });

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send("Failed to add product.");
  }
});

// ✅ GET: Admin logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
