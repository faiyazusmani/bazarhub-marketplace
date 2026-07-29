const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbFile = path.join(__dirname, '../data/db.json');
const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const seedUser = {
  _id: 'user_demo_1',
  name: 'Rahul Sharma',
  email: 'demo@bazarhub.com',
  phone: '+91 9876543210',
  password: bcrypt.hashSync('123456', 10),
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  createdAt: new Date().toISOString()
};

const initialSeed = {
  users: [seedUser],
  listings: [
    // Electronics
    {
      _id: 'list_1',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'product',
      name: 'iPhone 15 Pro Max - 256GB Natural Titanium',
      detail: 'Brand new sealed box iPhone 15 Pro Max with official Apple Warranty. 100% Battery health, pristine condition with original box and cable.',
      category: 'Electronics',
      subcategory: 'Mobile Phones',
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Connaught Place',
      price: 119999,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
      ],
      isActive: true,
      views: 142,
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
      _id: 'list_1b',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'product',
      name: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD)',
      detail: 'Space Black M3 Max MacBook Pro in mint condition. Includes AppleCare+ till 2026. Perfect for video editing, 3D rendering, and software engineering.',
      category: 'Electronics',
      subcategory: 'Laptops',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      area: 'Indiranagar',
      price: 245000,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
      ],
      isActive: true,
      views: 210,
      createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
    },
    {
      _id: 'list_1c',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'product',
      name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      detail: 'Top rated industry-leading active noise cancellation headphones. Black color, 30 hours battery life, comes with original hard carrying case.',
      category: 'Electronics',
      subcategory: 'TV & Audio',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      area: 'Andheri West',
      price: 22500,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'
      ],
      isActive: true,
      views: 95,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },

    // Vehicles
    {
      _id: 'list_2',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'product',
      name: 'Royal Enfield Classic 350 (Stealth Black 2023)',
      detail: 'Single owner, mint condition Royal Enfield Classic 350. Dual channel ABS, first-party comprehensive insurance valid till 2026. Only 4,200 km driven.',
      category: 'Vehicles',
      subcategory: 'Motorcycles',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      area: 'Bandra West',
      price: 185000,
      images: [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800'
      ],
      isActive: true,
      views: 310,
      createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString()
    },
    {
      _id: 'list_2b',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'product',
      name: 'Hyundai Creta SX (O) Turbo 1.4 Petrol DCT 2022',
      detail: 'Panoramic Sunroof, Bose 8-Speaker System, Ventilated Seats, 10.25-inch Touchscreen Infotainment, 18,500 kms driven, scratchless condition.',
      category: 'Vehicles',
      subcategory: 'Cars',
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      area: 'Gachibowli',
      price: 1420000,
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'
      ],
      isActive: true,
      views: 450,
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },

    // Property
    {
      _id: 'list_3',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'product',
      name: 'Luxury 3 BHK Fully Furnished Apartment in HSR Layout',
      detail: 'Spacious 1,850 sq.ft 3BHK flat with modular kitchen, wooden flooring, 2 covered car parkings, swimming pool, gym, 24x7 security & power backup.',
      category: 'Property',
      subcategory: 'Apartments',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      area: 'HSR Layout',
      price: 14500000,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
      ],
      isActive: true,
      views: 520,
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
    },

    // Jobs
    {
      _id: 'list_4',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'service',
      name: 'Senior Full Stack React & Node.js Developer (Hybrid)',
      detail: 'We are hiring a Senior Full Stack Engineer with 3+ years experience in React, Node.js, Express, MongoDB, and TypeScript. Competitive salary + equity.',
      category: 'Jobs',
      subcategory: 'Full Time',
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Gurugram Cyber City',
      price: 150000,
      images: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'
      ],
      isActive: true,
      views: 280,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },

    // Furniture
    {
      _id: 'list_5',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'product',
      name: 'Premium Leatherette L-Shape 6-Seater Sofa Set',
      detail: 'Comfortable high-density foam cushion L-shaped sofa set with adjustable headrests and cup holders. Dark grey color, 1 year old in excellent condition.',
      category: 'Furniture',
      subcategory: 'Sofas',
      country: 'India',
      state: 'Maharashtra',
      city: 'Pune',
      area: 'Koregaon Park',
      price: 32000,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800'
      ],
      isActive: true,
      views: 110,
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },

    // Fashion
    {
      _id: 'list_6',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'product',
      name: 'Nike Air Jordan 1 Retro High OG Chicago (Size UK 9)',
      detail: 'Original collector item Nike Air Jordan 1 Retro High sneakers. Worn twice, comes with original box and extra laces. Guaranteed 100% authentic.',
      category: 'Fashion',
      subcategory: 'Shoes',
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'South Extension',
      price: 18500,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'
      ],
      isActive: true,
      views: 175,
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 14).toISOString()
    },

    // Services
    {
      _id: 'list_7',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'service',
      name: 'Full Home Deep Cleaning & Sanitization Service',
      detail: 'Professional deep cleaning for 2BHK/3BHK flats, sofa shampooing, bathroom scrubbing, kitchen degreasing, and UV sanitization with certified equipment.',
      category: 'Services',
      subcategory: 'Cleaning',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      area: 'Indiranagar',
      price: 2999,
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'
      ],
      isActive: true,
      views: 84,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },

    // Sports
    {
      _id: 'list_8',
      user: { _id: 'user_demo_1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'demo@bazarhub.com' },
      type: 'product',
      name: 'Decathlon Rockrider ST100 Mountain Bicycle 27.5 T',
      detail: 'Lightweight aluminum frame 21-speed Shimano gear mountain bicycle. Front suspension, mechanical disc brakes, gel seat cover and LED headlamp included.',
      category: 'Sports',
      subcategory: 'Cycling',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      area: 'Malviya Nagar',
      price: 14500,
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800'
      ],
      isActive: true,
      views: 130,
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 20).toISOString()
    }
  ]
};

function loadDB() {
  if (!fs.existsSync(dbFile)) {
    saveDB(initialSeed);
    return initialSeed;
  }
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.listings || parsed.listings.length === 0) {
      saveDB(initialSeed);
      return initialSeed;
    }
    return parsed;
  } catch (e) {
    saveDB(initialSeed);
    return initialSeed;
  }
}

function saveDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { loadDB, saveDB };
