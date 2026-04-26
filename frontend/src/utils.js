export const getCategoryIcon = (cat) => ({
  Electronics: '⚡', Vehicles: '🚗', Property: '🏠', Jobs: '💼',
  Furniture: '🛋️', Fashion: '👗', Services: '🔧', Sports: '⚽'
}[cat] || '📦');

export const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN');

export const timeAgo = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (d < 60) return 'just now';
  if (d < 3600) return Math.floor(d / 60) + ' min ago';
  if (d < 86400) return Math.floor(d / 3600) + ' hr ago';
  if (d < 604800) return Math.floor(d / 86400) + ' days ago';
  return new Date(iso).toLocaleDateString('en-IN');
};

export const getImageUrl = (path) =>
  path ? `http://localhost:5000${path}` : null;
