export const getCategoryIcon = (cat) => ({
  Electronics: '📱', Vehicles: '🚗', Property: '🏢', Jobs: '💼',
  Furniture: '🛋️', Fashion: '👟', Services: '🛠️', Sports: '🚴'
}[cat] || '📦');

export const getCityEmoji = (city) => ({
  'New Delhi': '🏛️', Delhi: '🏛️', Mumbai: '🌊', Bangalore: '💻',
  Hyderabad: '🏰', Pune: '⛰️', Jaipur: '🏰', Kolkata: '🌉', Chennai: '🏖️'
}[city] || '🏙️');

export const SUBCATEGORIES_MAP = {
  Electronics: ['Mobile Phones', 'Laptops', 'Tablets', 'Cameras', 'TV & Audio', 'Accessories'],
  Vehicles: ['Cars', 'Motorcycles', 'Scooters', 'Trucks', 'Bicycles', 'Spare Parts'],
  Property: ['Apartments', 'Houses', 'Plots', 'Commercial', 'PG / Hostel', 'Flatmates'],
  Jobs: ['Full Time', 'Part Time', 'Freelance', 'Internship', 'Work From Home'],
  Furniture: ['Sofas', 'Beds', 'Tables', 'Chairs', 'Wardrobes', 'Decor'],
  Fashion: ['Men\'s Clothing', 'Women\'s Clothing', 'Kids', 'Shoes', 'Bags', 'Jewellery'],
  Services: ['Repair', 'Cleaning', 'Tutoring', 'Beauty', 'Delivery', 'Healthcare'],
  Sports: ['Cricket', 'Football', 'Fitness', 'Cycling', 'Outdoor', 'Other Sports']
};

export const formatPrice = (p) => {
  if (p === undefined || p === null) return '₹0';
  return '₹' + Number(p).toLocaleString('en-IN');
};

export const timeAgo = (iso) => {
  if (!iso) return '';
  const d = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (d < 60) return 'Just now';
  if (d < 3600) return Math.floor(d / 60) + ' min ago';
  if (d < 86400) return Math.floor(d / 3600) + ' hr ago';
  if (d < 604800) return Math.floor(d / 86400) + ' days ago';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `http://localhost:5000${path}`;
};

// Saved / Favorites helper in localStorage
export const getSavedIds = () => {
  try {
    return JSON.parse(localStorage.getItem('bh_saved') || '[]');
  } catch (e) {
    return [];
  }
};

export const toggleSavedId = (id) => {
  const saved = getSavedIds();
  const index = saved.indexOf(id);
  let updated;
  if (index > -1) {
    updated = saved.filter(x => x !== id);
  } else {
    updated = [...saved, id];
  }
  localStorage.setItem('bh_saved', JSON.stringify(updated));
  return updated;
};

export const isSavedId = (id) => {
  return getSavedIds().includes(id);
};
