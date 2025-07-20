require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");

const app = express();

// ✅ Models
const Category = require("./models/category");

// ✅ Routes
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require("./routes/product");
const cartRoutes = require('./routes/cartRoutes');

// ✅ MongoDB Connection
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB error:", err));

// ✅ View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Static Folder (serve everything inside /public)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false
}));

// ✅ Global user/admin access
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.admin = req.session.admin || null;
  next();
});

// ✅ Routes
app.use('/category', categoryRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/product', productRoutes);
app.use('/', cartRoutes); // Handles /cart

// ✅ Home route
app.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("home", { categories });
  } catch (err) {
    console.error("❌ Error loading homepage:", err);
    res.status(500).send("Error loading homepage");
  }
});

// ✅ Uploads (if any)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ 404 Page
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
