import { getCategoryIcon, formatPrice, timeAgo, getImageUrl } from '../utils';

export default function ListingCard({ listing: l, onClick }) {
  const imgSrc = l.images && l.images.length > 0 ? getImageUrl(l.images[0]) : null;
  return (
    <div className="listing-card" onClick={() => onClick(l._id || l.id)}>
      <div className="listing-img">
        {imgSrc ? <img src={imgSrc} alt={l.name} /> : <span>{getCategoryIcon(l.category)}</span>}
        <div className="listing-img-badge">
          <span className={`badge badge-${l.type === 'service' ? 'blue' : 'orange'}`}>
            {l.type === 'service' ? 'Service' : 'Product'}
          </span>
        </div>
      </div>
      <div className="listing-body">
        <div className="listing-price">
          {formatPrice(l.price)}{l.type === 'service' ? '/mo' : ''}
        </div>
        <div className="listing-name">{l.name}</div>
        <div className="listing-meta">
          <span>📍 {l.city}</span>
          <span>•</span>
          <span>{timeAgo(l.createdAt)}</span>
        </div>
        <div style={{ marginTop: 6 }}>
          <span className="tag">{l.category}</span>
        </div>
      </div>
    </div>
  );
}
