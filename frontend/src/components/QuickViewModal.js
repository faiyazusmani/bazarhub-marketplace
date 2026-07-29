import { useState } from 'react';
import { getCategoryIcon, formatPrice, timeAgo, getImageUrl } from '../utils';

export default function QuickViewModal({ listing, onClose, onViewFull, onInquire }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  if (!listing) return null;

  const images = listing.images && listing.images.length > 0 ? listing.images : [];
  const currentImg = images.length > 0 ? getImageUrl(images[activeImgIdx]) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 760 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span style={{ fontSize: 20, marginRight: 8 }}>{getCategoryIcon(listing.category)}</span>
            Quick Preview
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ padding: 24 }}>
          <div className="layout-flex">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ height: 280, background: '#0f172a', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentImg ? (
                  <img src={currentImg} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 80, color: '#fff' }}>{getCategoryIcon(listing.category)}</span>
                )}
              </div>

              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto' }}>
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={getImageUrl(img)}
                      alt=""
                      onClick={() => setActiveImgIdx(i)}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 8,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: activeImgIdx === i ? '2.5px solid var(--primary)' : '2px solid transparent'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div style={{ flex: 1.2, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <span className={`badge ${listing.type === 'service' ? 'badge-blue' : 'badge-orange'}`}>
                  {listing.type === 'service' ? 'Service' : 'Product'}
                </span>
                <span className="badge badge-gray">{listing.category}</span>
                {listing.subcategory && <span className="badge badge-gray">{listing.subcategory}</span>}
              </div>

              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
                {listing.name}
              </h2>

              <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: 'var(--primary)', marginBottom: 14 }}>
                {formatPrice(listing.price)}
                {listing.type === 'service' ? <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>/month</span> : ''}
              </div>

              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, display: 'flex', gap: 12 }}>
                <span>📍 {listing.city}, {listing.state}</span>
                <span>•</span>
                <span>👁️ {listing.views || 0} views</span>
                <span>•</span>
                <span>{timeAgo(listing.createdAt)}</span>
              </div>

              <div style={{
                fontSize: 14,
                color: '#334155',
                lineHeight: 1.6,
                background: '#f8fafc',
                padding: 14,
                borderRadius: 10,
                marginBottom: 20,
                maxHeight: 120,
                overflowY: 'auto',
                border: '1px solid var(--border)'
              }}>
                {listing.detail}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => { onClose(); onViewFull(listing._id || listing.id); }}
                >
                  View Full Details →
                </button>

                {onInquire && (
                  <button
                    className="btn btn-outline"
                    onClick={() => { onClose(); onInquire(listing); }}
                  >
                    💬 Contact
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
