const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['product', 'service'], required: true },
  name: { type: String, required: true, trim: true },
  detail: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for fast queries
listingSchema.index({ city: 1, category: 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ user: 1 });
listingSchema.index({ name: 'text', detail: 'text' });

listingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
