import { useState, useEffect } from 'react';
import { createListing, getCategories, getLocations } from '../api';

export default function PostModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ type: 'product', name: '', detail: '', category: '', subcategory: '', country: '', state: '', city: '', area: '', price: '' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState({});
  const [locations, setLocations] = useState({});
  const [areas, setAreas] = useState([]);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.categories)).catch(() => {});
    getLocations().then(r => { setLocations(r.data.locations); setAreas(r.data.areas); }).catch(() => {});
  }, []);

  const set = k => e => {
    const v = e.target.value;
    setForm(f => {
      const next = { ...f, [k]: v };
      if (k === 'country') { next.state = ''; next.city = ''; }
      if (k === 'state') { next.city = ''; }
      if (k === 'category') next.subcategory = '';
      return next;
    });
  };

  const states = form.country && locations[form.country] ? Object.keys(locations[form.country]) : [];
  const cities = form.state && form.country && locations[form.country] ? (locations[form.country][form.state] || []) : [];
  const subcats = form.category && categories[form.category] ? categories[form.category] : [];

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.country || !form.state || !form.city || !form.price) {
      setErr('Please fill all required fields'); return;
    }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) { setErr('Enter a valid price'); return; }
    setLoading(true); setErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      await createListing(fd);
      setSuccess(true);
      setTimeout(onSuccess, 1000);
    } catch (e) {
      setErr(e.response?.data?.message || (e.response?.data?.errors?.[0]?.msg) || 'Failed to post listing');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Post New Ad</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {success ? (
            <div className="alert alert-success" style={{ textAlign: 'center', fontSize: 15, padding: 24 }}>
              ✅ Your ad has been posted successfully!
            </div>
          ) : (
            <>
              {err && <div className="alert alert-error">{err}</div>}

              {/* Type */}
              <div className="field">
                <label className="label label-req">Listing Type</label>
                <div className="type-picker">
                  <div className={`type-opt ${form.type === 'product' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, type: 'product' }))}>📦 Product</div>
                  <div className={`type-opt ${form.type === 'service' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, type: 'service' }))}>🔧 Service</div>
                </div>
              </div>

              {/* Name */}
              <div className="field">
                <label className="label label-req">Title</label>
                <input className="input" placeholder="e.g. iPhone 14 Pro 256GB — Like New" value={form.name} onChange={set('name')} />
              </div>

              {/* Detail */}
              <div className="field">
                <label className="label">Description</label>
                <textarea className="input" rows={3} placeholder="Describe condition, specifications, reason for selling..." value={form.detail} onChange={set('detail')} style={{ resize: 'vertical' }} />
              </div>

              {/* Category */}
              <div className="row2">
                <div className="field">
                  <label className="label label-req">Category</label>
                  <select className="input" value={form.category} onChange={set('category')}>
                    <option value="">Select category...</option>
                    {Object.keys(categories).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Subcategory</label>
                  <select className="input" value={form.subcategory} onChange={set('subcategory')} disabled={!form.category}>
                    <option value="">Select subcategory...</option>
                    {subcats.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="row3">
                <div className="field">
                  <label className="label label-req">Country</label>
                  <select className="input" value={form.country} onChange={set('country')}>
                    <option value="">Country...</option>
                    {Object.keys(locations).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="label label-req">State</label>
                  <select className="input" value={form.state} onChange={set('state')} disabled={!form.country}>
                    <option value="">State...</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="label label-req">City</label>
                  <select className="input" value={form.city} onChange={set('city')} disabled={!form.state}>
                    <option value="">City...</option>
                    {cities.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Area */}
              <div className="field">
                <label className="label">Area / Locality</label>
                <select className="input" value={form.area} onChange={set('area')}>
                  <option value="">Select area...</option>
                  {areas.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              {/* Price */}
              <div className="field">
                <label className="label label-req">Price (₹){form.type === 'service' ? ' per month' : ''}</label>
                <input className="input" type="number" placeholder="e.g. 5000" value={form.price} onChange={set('price')} min="1" />
              </div>

              {/* Images */}
              <div className="field">
                <label className="label">Photos (max 5)</label>
                <input type="file" accept="image/*" multiple onChange={handleImages} style={{ fontSize: 13 }} />
                {previews.length > 0 && (
                  <div className="img-preview-grid">
                    {previews.map((src, i) => <img key={i} src={src} alt="" className="img-preview" />)}
                  </div>
                )}
              </div>

              <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Posting...' : '🚀 Post Ad'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
