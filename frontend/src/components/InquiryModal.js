import { useState } from 'react';
import { formatPrice } from '../utils';

export default function InquiryModal({ listing, user, onClose, onRequireAuth }) {
  const [msg, setMsg] = useState('Hi, is this item still available? I am interested in buying.');
  const [sent, setSent] = useState(false);

  if (!listing) return null;

  const quickMessages = [
    'Hi, is this item still available?',
    'What is your final negotiable price?',
    'Can I inspect this item in person?',
    'Can you ship/deliver this to my location?'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      onClose();
      onRequireAuth();
      return;
    }
    setSent(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">💬 Message Seller</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Message Sent Successfully!
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
                The seller <strong>{listing.user?.name}</strong> has received your inquiry. They will contact you at <strong>{user?.email || user?.phone}</strong> soon.
              </p>
              <button className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: 12, background: '#f8fafc', padding: 14, borderRadius: 10, marginBottom: 18, border: '1px solid var(--border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                  {listing.user?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{listing.user?.name || 'Verified Seller'}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Ad: {listing.name} ({formatPrice(listing.price)})</div>
                </div>
              </div>

              <div className="field">
                <label className="label">Quick Preset Messages</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {quickMessages.map((qm, i) => (
                    <span
                      key={i}
                      onClick={() => setMsg(qm)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 16,
                        background: msg === qm ? 'var(--primary-light)' : '#f1f5f9',
                        color: msg === qm ? 'var(--primary)' : 'var(--muted)',
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: 500,
                        border: msg === qm ? '1px solid var(--primary)' : '1px solid transparent'
                      }}
                    >
                      {qm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="label label-req">Your Message</label>
                <textarea
                  className="input"
                  rows={4}
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Type your message to the seller..."
                  required
                />
              </div>

              {!user && (
                <div className="alert alert-error" style={{ fontSize: 13 }}>
                  ⚠️ You must be logged in to send a message to the seller.
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8 }}>
                Send Message 🚀
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
