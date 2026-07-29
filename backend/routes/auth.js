const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { loadDB, saveDB } = require('../db/fallback');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'bazarhub_super_secret_jwt_key_change_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { name, email, phone, password } = req.body;

    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
      const user = await User.create({ name, email, phone, password });
      const token = signToken(user._id);
      return res.status(201).json({ success: true, token, user });
    }

    // Fallback mode
    const db = loadDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: 'user_' + Date.now(),
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      avatar: '',
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDB(db);

    const userObj = { ...newUser };
    delete userObj.password;
    const token = signToken(newUser._id);
    res.status(201).json({ success: true, token, user: userObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      const token = signToken(user._id);
      return res.json({ success: true, token, user: user.toJSON() });
    }

    // Fallback mode
    const db = loadDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const userObj = { ...user };
    delete userObj.password;
    const token = signToken(user._id);
    res.json({ success: true, token, user: userObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me  (protected)
router.get('/me', protect, async (req, res) => {
  const userObj = { ...req.user };
  if (userObj.password) delete userObj.password;
  res.json({ success: true, user: userObj });
});

// PUT /api/auth/update  (protected)
router.put('/update', protect, [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().trim().notEmpty(),
], async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (mongoose.connection.readyState === 1) {
      const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true, runValidators: true });
      return res.json({ success: true, user });
    }

    // Fallback mode
    const db = loadDB();
    const idx = db.users.findIndex(u => u._id.toString() === req.user._id.toString());
    if (idx !== -1) {
      if (name) db.users[idx].name = name;
      if (phone) db.users[idx].phone = phone;
      saveDB(db);
      const userObj = { ...db.users[idx] };
      delete userObj.password;
      return res.json({ success: true, user: userObj });
    }
    res.status(404).json({ success: false, message: 'User not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/change-password  (protected)
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('+password');
      if (!(await user.comparePassword(currentPassword))) {
        return res.status(400).json({ success: false, message: 'Current password is wrong' });
      }
      user.password = newPassword;
      await user.save();
      return res.json({ success: true, message: 'Password changed successfully' });
    }

    // Fallback mode
    const db = loadDB();
    const idx = db.users.findIndex(u => u._id.toString() === req.user._id.toString());
    if (idx !== -1) {
      const isMatch = await bcrypt.compare(currentPassword, db.users[idx].password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is wrong' });
      }
      db.users[idx].password = await bcrypt.hash(newPassword, 10);
      saveDB(db);
      return res.json({ success: true, message: 'Password changed successfully' });
    }
    res.status(404).json({ success: false, message: 'User not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
