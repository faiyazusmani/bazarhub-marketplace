const express = require('express');
const router = express.Router();

const CATEGORIES = {
  "Electronics": ["Mobile Phones", "Laptops", "Tablets", "Cameras", "TV & Audio", "Accessories"],
  "Vehicles": ["Cars", "Motorcycles", "Scooters", "Trucks", "Bicycles", "Spare Parts"],
  "Property": ["Apartments", "Houses", "Plots", "Commercial", "PG / Hostel", "Flatmates"],
  "Jobs": ["Full Time", "Part Time", "Freelance", "Internship", "Work From Home"],
  "Furniture": ["Sofas", "Beds", "Tables", "Chairs", "Wardrobes", "Decor"],
  "Fashion": ["Men's Clothing", "Women's Clothing", "Kids", "Shoes", "Bags", "Jewellery"],
  "Services": ["Repair", "Cleaning", "Tutoring", "Beauty", "Delivery", "Healthcare"],
  "Sports": ["Cricket", "Football", "Fitness", "Cycling", "Outdoor", "Other Sports"],
};

const LOCATIONS = {
  "India": {
    "Punjab": ["Amritsar", "Ludhiana", "Pathankot", "Jalandhar", "Patiala", "Bathinda"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "Noida", "Gurgaon", "Faridabad"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida", "Meerut"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  },
  "USA": {
    "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose"],
    "New York": ["New York City", "Buffalo", "Albany", "Syracuse", "Rochester"],
    "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
  },
  "UK": {
    "England": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
    "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
  },
};

const AREAS = ["City Center", "North Zone", "South Zone", "East Zone", "West Zone", "Suburbs", "Industrial Area", "Old City", "New Town", "Highway Area", "Sector 1", "Sector 2", "Sector 3"];

// GET /api/categories
router.get('/', (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
});

// GET /api/categories/locations
router.get('/locations', (req, res) => {
  res.json({ success: true, locations: LOCATIONS, areas: AREAS });
});

module.exports = router;
