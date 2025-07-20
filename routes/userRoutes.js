const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// GET: Signup page
router.get('/signup', (req, res) => {
  res.render('userSignup');
});

// POST: Secure user signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const existing = await User.findOne({ email });

    if (existing) return res.send('User already exists. Please login.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, address,phone });
    await user.save();

    res.redirect('/user/login');
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).send('Signup failed.');
  }
});

// GET: Login page
// GET: Login page
router.get('/login', (req, res) => {
  res.render('userLogin', { redirect: req.query.redirect || '' });
});

// POST: Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.send('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone
    };

    const redirectUrl = req.query.redirect || '/';
    res.redirect(redirectUrl);
  } else {
    res.send('Invalid email or password');
  }
});


// GET: Logout user
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
