const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/product");
const multer = require("multer");
const path = require("path");

// 🔸 Helper to get userId
function getUserId(req) {
  return req.session.user?._id || "guest-user";
}

// 🔐 Middleware to check login
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  return res.redirect("/login");
}

// ✅ Navbar badge - Inject totalQty globally
router.use(async (req, res, next) => {
  const userId = getUserId(req);
  const cart = await Cart.findOne({ userId });
  res.locals.totalQty = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  next();
});

// ✅ Add product to cart
router.post("/add-to-cart/:productId", isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    const productId = req.params.productId;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], tip: 0, paymentMethod: "" });
    }

    const index = cart.items.findIndex(item => item.product.toString() === productId);
    if (index > -1) {
      cart.items[index].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).send("Something went wrong.");
  }
});

// ✅ View Cart
router.get("/cart", isAuthenticated, async (req, res) => {
  const userId = getUserId(req);
  const cart = await Cart.findOne({ userId }).populate("items.product");
  res.render("cart", {
    cart: cart || { items: [], tip: 0, paymentMethod: "" }
  });
});

// ✅ Update item quantity
router.post("/cart/update-quantity", isAuthenticated, async (req, res) => {
  const userId = getUserId(req);
  const { productId, action } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.redirect("/cart");

  const item = cart.items.find(i => i.product.toString() === productId);
  if (!item) return res.redirect("/cart");

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;
    if (item.quantity < 1) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    }
  }

  await cart.save();
  res.redirect("/cart");
});

// ✅ Remove item from cart
router.post("/cart/remove-item", isAuthenticated, async (req, res) => {
  const userId = getUserId(req);
  const { productId } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.redirect("/cart");

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();

  res.redirect("/cart");
});

// ✅ Update payment method
router.post("/cart/payment-method", isAuthenticated, async (req, res) => {
  const userId = getUserId(req);
  const { method } = req.body;

  await Cart.findOneAndUpdate({ userId }, { paymentMethod: method });
  res.redirect("/cart");
});

// ✅ Apply Promo Code (future use)
router.post("/cart/apply-coupon", isAuthenticated, async (req, res) => {
  res.redirect("/cart");
});

// ✅ Upload payment screenshot
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `payment_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post("/cart/upload-confirmation", isAuthenticated, upload.single("screenshot"), async (req, res) => {
  const userId = getUserId(req);
  const imagePath = `/uploads/${req.file.filename}`;

  await Cart.findOneAndUpdate({ userId }, { paymentScreenshot: imagePath });
  res.redirect("/cart");
});

module.exports = router;
