import { useState } from 'react';
import { getCategoryIcon, formatPrice, timeAgo, getImageUrl, isSavedId, toggleSavedId } from '../utils';

export default function ListingCard({ listing: l, onClick, onQuickView }) {
  const [saved, setSaved] = useState(() => isSavedId(l._id || l.id));
  const imgSrc = l.images && l.images.length > 0 ? getImageUrl(l.images[0]) : null;

  const handleToggleFav = (e) => {
    e.stopPropagation();
    const updated = toggleSavedId(l._id || l.id);
    setSaved(updated.includes(l._id || l.id));
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(l);
  };

  return (
    <div className="listing-card" onClick={() => onClick(l._id || l.id)}>
      <div className="listing-img">
        {imgSrc ? (
          <img src={imgSrc} alt={l.name} loading="lazy" />
        ) : (
          <span>{getCategoryIcon(l.category)}</span>
        )}

        <div className="listing-type-badge">
          <span className={`badge ${l.type === 'service' ? 'badge-blue' : 'badge-orange'}`}>
            {l.type === 'service' ? 'Service' : 'Product'}
          </span>
        </div>

        <button
          className={`listing-fav-btn ${saved ? 'saved' : ''}`}
          onClick={handleToggleFav}
          title={saved ? 'Remove from saved' : 'Save ad'}
        >
          {saved ? '❤️' : '🤍'}
        </button>

        {onQuickView && (
          <button className="listing-quick-view" onClick={handleQuickView}>
            👁️ Quick Preview
          </button>
        )}
      </div>

      <div className="listing-body">
        <div className="listing-price">
          {formatPrice(l.price)}
          {l.type === 'service' ? <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>/mo</span> : ''}
        </div>

        <div className="listing-name" title={l.name}>
          {l.name}
        </div>

        <div style={{ marginBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="badge badge-gray">{l.category}</span>
          {l.subcategory && <span className="badge badge-gray">{l.subcategory}</span>}
        </div>

        <div className="listing-meta">
          <div className="listing-location">
            <span>📍</span>
            <span>{l.city}</span>
          </div>
          <span>{timeAgo(l.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
