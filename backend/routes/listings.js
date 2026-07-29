const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');
const { loadDB, saveDB } = require('../db/fallback');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `listing-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});

// GET /api/listings  — All listings with filters
router.get('/', async (req, res) => {
  try {
    const { category, city, state, country, subcategory, type, search, minPrice, maxPrice, sort = '-createdAt', page = 1, limit = 20 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { isActive: true };
      if (category) query.category = category;
      if (city) query.city = city;
      if (state) query.state = state;
      if (country) query.country = country;
      if (subcategory) query.subcategory = subcategory;
      if (type) query.type = type;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { detail: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
        ];
      }
      const skip = (Number(page) - 1) * Number(limit);
      const [listings, total] = await Promise.all([
        Listing.find(query).sort(sort).skip(skip).limit(Number(limit)).populate('user', 'name phone email'),
        Listing.countDocuments(query)
      ]);
      return res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), listings });
    }

    // Fallback mode
    const db = loadDB();
    let filtered = db.listings.filter(l => l.isActive !== false);

    if (category) filtered = filtered.filter(l => l.category.toLowerCase() === category.toLowerCase());
    if (city) filtered = filtered.filter(l => l.city.toLowerCase() === city.toLowerCase());
    if (state) filtered = filtered.filter(l => l.state.toLowerCase() === state.toLowerCase());
    if (country) filtered = filtered.filter(l => l.country.toLowerCase() === country.toLowerCase());
    if (subcategory) filtered = filtered.filter(l => l.subcategory.toLowerCase() === subcategory.toLowerCase());
    if (type) filtered = filtered.filter(l => l.type === type);
    if (minPrice) filtered = filtered.filter(l => Number(l.price) >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(l => Number(l.price) <= Number(maxPrice));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(l =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.detail && l.detail.toLowerCase().includes(q)) ||
        (l.category && l.category.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const skip = (Number(page) - 1) * Number(limit);
    const listings = filtered.slice(skip, skip + Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit) || 1, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/listings/my  — logged-in user's listings
router.get('/my', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const listings = await Listing.find({ user: req.user._id }).sort('-createdAt');
      return res.json({ success: true, listings });
    }

    // Fallback mode
    const db = loadDB();
    const userIdStr = req.user._id ? req.user._id.toString() : req.user.id;
    const listings = db.listings.filter(l => {
      const lUserId = typeof l.user === 'object' ? l.user._id : l.user;
      return lUserId && lUserId.toString() === userIdStr;
    });
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/listings/stats  — city and category stats
router.get('/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const [cityStats, catStats] = await Promise.all([
        Listing.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: { city: '$city', state: '$state', country: '$country' }, count: { $sum: 1 } } },
          { $sort: { count: -1 } }, { $limit: 20 }
        ]),
        Listing.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])
      ]);
      return res.json({ success: true, cityStats, catStats });
    }

    // Fallback mode
    const db = loadDB();
    const active = db.listings.filter(l => l.isActive !== false);

    const cityMap = {};
    const catMap = {};

    active.forEach(l => {
      const cityKey = `${l.city}|${l.state}|${l.country}`;
      cityMap[cityKey] = (cityMap[cityKey] || 0) + 1;
      catMap[l.category] = (catMap[l.category] || 0) + 1;
    });

    const cityStats = Object.keys(cityMap).map(key => {
      const [city, state, country] = key.split('|');
      return { _id: { city, state, country }, count: cityMap[key] };
    }).sort((a, b) => b.count - a.count);

    const catStats = Object.keys(catMap).map(cat => ({
      _id: cat,
      count: catMap[cat]
    })).sort((a, b) => b.count - a.count);

    res.json({ success: true, cityStats, catStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const listing = await Listing.findById(req.params.id).populate('user', 'name phone email createdAt');
      if (!listing || !listing.isActive) return res.status(404).json({ success: false, message: 'Listing not found' });
      listing.views += 1;
      await listing.save();
      return res.json({ success: true, listing });
    }

    // Fallback mode
    const db = loadDB();
    const listing = db.listings.find(l => l._id.toString() === req.params.id);
    if (!listing || listing.isActive === false) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    listing.views = (listing.views || 0) + 1;
    saveDB(db);
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/listings  — create listing (protected)
router.post('/', protect, upload.array('images', 5), [
  body('type').isIn(['product', 'service']).withMessage('Type must be product or service'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('detail').trim().notEmpty().withMessage('Detail is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    if (mongoose.connection.readyState === 1) {
      const listing = await Listing.create({ ...req.body, price: Number(req.body.price), user: req.user._id, images });
      await listing.populate('user', 'name phone email');
      return res.status(201).json({ success: true, listing });
    }

    // Fallback mode
    const db = loadDB();
    const newListing = {
      _id: 'list_' + Date.now(),
      user: {
        _id: req.user._id || req.user.id,
        name: req.user.name,
        phone: req.user.phone,
        email: req.user.email
      },
      type: req.body.type,
      name: req.body.name,
      detail: req.body.detail,
      category: req.body.category,
      subcategory: req.body.subcategory || '',
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      area: req.body.area || '',
      price: Number(req.body.price),
      images,
      isActive: true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.listings.unshift(newListing);
    saveDB(db);
    res.status(201).json({ success: true, listing: newListing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/listings/:id  — update listing (protected, owner only)
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const listing = await Listing.findById(req.params.id);
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
      if (listing.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
      }
      const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
      const updatedData = { ...req.body, images: [...(listing.images || []), ...newImages] };
      if (req.body.price) updatedData.price = Number(req.body.price);
      const updated = await Listing.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true }).populate('user', 'name phone email');
      return res.json({ success: true, listing: updated });
    }

    // Fallback mode
    const db = loadDB();
    const idx = db.listings.findIndex(l => l._id.toString() === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Listing not found' });

    const ownerId = typeof db.listings[idx].user === 'object' ? db.listings[idx].user._id : db.listings[idx].user;
    if (ownerId.toString() !== (req.user._id || req.user.id).toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    Object.assign(db.listings[idx], req.body);
    if (req.body.price) db.listings[idx].price = Number(req.body.price);
    if (newImages.length > 0) {
      db.listings[idx].images = [...(db.listings[idx].images || []), ...newImages];
    }
    db.listings[idx].updatedAt = new Date().toISOString();
    saveDB(db);
    res.json({ success: true, listing: db.listings[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/listings/:id  — delete listing (protected, owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const listing = await Listing.findById(req.params.id);
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
      if (listing.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      await Listing.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Listing deleted' });
    }

    // Fallback mode
    const db = loadDB();
    const idx = db.listings.findIndex(l => l._id.toString() === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Listing not found' });

    const ownerId = typeof db.listings[idx].user === 'object' ? db.listings[idx].user._id : db.listings[idx].user;
    if (ownerId.toString() !== (req.user._id || req.user.id).toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    db.listings.splice(idx, 1);
    saveDB(db);
    res.json({ success: true, message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
