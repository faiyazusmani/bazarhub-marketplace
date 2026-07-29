const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { loadDB } = require('../db/fallback');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please login.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bazarhub_super_secret_jwt_key_change_in_production');
    
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id);
    } else {
      const db = loadDB();
      user = db.users.find(u => u._id.toString() === decoded.id.toString());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
  }
};

module.exports = { protect };
