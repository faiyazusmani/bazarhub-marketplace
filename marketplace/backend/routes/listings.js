const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});

// GET /api/listings  — All listings with filters
router.get('/', async (req, res) => {
  try {
    const { category, city, state, country, subcategory, type, search, minPrice, maxPrice, sort = '-createdAt', page = 1, limit = 20 } = req.query;
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

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/listings/my  — logged-in user's listings
router.get('/my', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/listings/stats  — city and category stats
router.get('/stats', async (req, res) => {
  try {
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
    res.json({ success: true, cityStats, catStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('user', 'name phone email createdAt');
    if (!listing || !listing.isActive) return res.status(404).json({ success: false, message: 'Listing not found' });
    listing.views += 1;
    await listing.save();
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
    const listing = await Listing.create({ ...req.body, price: Number(req.body.price), user: req.user._id, images });
    await listing.populate('user', 'name phone email');
    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/listings/:id  — update listing (protected, owner only)
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }
    const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const updatedData = { ...req.body, images: [...(listing.images || []), ...newImages] };
    if (req.body.price) updatedData.price = Number(req.body.price);
    const updated = await Listing.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true }).populate('user', 'name phone email');
    res.json({ success: true, listing: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/listings/:id  — delete listing (protected, owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
