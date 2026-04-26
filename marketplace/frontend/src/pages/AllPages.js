import { useState, useEffect } from 'react';
import { getListings } from '../api';
import ListingCard from '../components/ListingCard';
import { getCategoryIcon, formatPrice, timeAgo, getImageUrl } from '../utils';

// CityPage
export function CityPage({ city, navigate, onCardClick }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const catCount = {};
  listings.forEach(l => { catCount[l.category] = (catCount[l.category] || 0) + 1; });

  useEffect(() => {
    getListings({ city, limit: 50 }).then(r => setListings(r.data.listings)).catch(() => {}).finally(() => setLoading(false));
  }, [city]);

  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-link" onClick={() => navigate('home')}>Home</span>
        <span className="bc-sep">›</span><span>{city}</span>
      </div>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🏙️ {city}</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>{listings.length} listings in {city}</div>
      {Object.keys(catCount).length > 0 && (<>
        <div className="section-title">Categories in {city}</div>
        <div className="cat-grid" style={{ marginBottom: 28 }}>
          {Object.entries(catCount).map(([cat, count]) => (
            <div key={cat} className="cat-card" onClick={() => navigate('listings', { city, category: cat })}>
              <span className="cat-icon">{getCategoryIcon(cat)}</span>
              <div className="cat-info"><div className="cat-name">{cat}</div><div className="cat-count">{count} listings</div></div>
            </div>
          ))}
        </div>
      </>)}
      <div className="section-title">All in {city}</div>
      {loading ? <div className="spinner">Loading...</div> : listings.length === 0 ? <div className="empty-state"><div className="empty-icon">📭</div><div>No listings yet</div></div> :
        <div className="listing-grid">{listings.map(l => <ListingCard key={l._id} listing={l} onClick={onCardClick} />)}</div>}
    </div>
  );
}

// CategoryPage
export function CategoryPage({ category, navigate, onCardClick }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const cityCount = {};
  listings.forEach(l => { cityCount[l.city] = (cityCount[l.city] || 0) + 1; });

  useEffect(() => {
    getListings({ category, limit: 50 }).then(r => setListings(r.data.listings)).catch(() => {}).finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-link" onClick={() => navigate('home')}>Home</span>
        <span className="bc-sep">›</span><span>{category}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <span style={{ fontSize: 42 }}>{getCategoryIcon(category)}</span>
        <div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700 }}>{category}</h1>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>{listings.length} listings</div>
        </div>
      </div>
      {Object.keys(cityCount).length > 0 && (<>
        <div className="section-title">Browse by City</div>
        <div className="city-grid">
          {Object.entries(cityCount).map(([city, count]) => (
            <div key={city} className="city-card" onClick={() => navigate('listings', { city, category })}>
              <div className="city-emoji">🏙️</div>
              <div className="city-name">{city}</div>
              <div className="city-count">{count} listings</div>
            </div>
          ))}
        </div>
      </>)}
      <div className="section-title">All in {category}</div>
      {loading ? <div className="spinner">Loading...</div> : listings.length === 0 ? <div className="empty-state"><div className="empty-icon">📭</div><div>No listings yet</div></div> :
        <div className="listing-grid">{listings.map(l => <ListingCard key={l._id} listing={l} onClick={onCardClick} />)}</div>}
    </div>
  );
}

// ListingsPage
export function ListingsPage({ city, category, navigate, onCardClick }) {
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('-createdAt');
  const [typeFilter, setTypeFilter] = useState('');
  const [minP, setMinP] = useState('');
  const [maxP, setMaxP] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { sort, limit: 30 };
    if (city) params.city = city;
    if (category) params.category = category;
    if (typeFilter) params.type = typeFilter;
    if (minP) params.minPrice = minP;
    if (maxP) params.maxPrice = maxP;
    getListings(params).then(r => { setListings(r.data.listings); setTotal(r.data.total); }).catch(() => {}).finally(() => setLoading(false));
  }, [city, category, sort, typeFilter, minP, maxP]);

  const title = [city, category].filter(Boolean).join(' › ') || 'All Listings';

  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-link" onClick={() => navigate('home')}>Home</span>
        {city && <><span className="bc-sep">›</span><span className="bc-link" onClick={() => navigate('city', { city })}>{city}</span></>}
        {category && <><span className="bc-sep">›</span><span>{category}</span></>}
      </div>
      <div className="layout-flex">
        <div className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">Type</div>
            {[['', 'All'], ['product', 'Products'], ['service', 'Services']].map(([val, label]) => (
              <div key={val} className={`filter-chip ${typeFilter === val ? 'active' : ''}`} onClick={() => setTypeFilter(val)}>{label}</div>
            ))}
          </div>
          <div className="sidebar-card">
            <div className="sidebar-title">Price Range (₹)</div>
            <div className="field"><label className="label">Min</label><input className="input" type="number" placeholder="0" value={minP} onChange={e => setMinP(e.target.value)} /></div>
            <div className="field" style={{ marginBottom: 0 }}><label className="label">Max</label><input className="input" type="number" placeholder="Any" value={maxP} onChange={e => setMaxP(e.target.value)} /></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="sort-bar">
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 600 }}>{title} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)' }}>({total})</span></div>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
          {loading ? <div className="spinner">Loading...</div> : listings.length === 0 ? <div className="empty-state"><div className="empty-icon">📭</div><div>No listings found</div></div> :
            <div className="listing-grid">{listings.map(l => <ListingCard key={l._id} listing={l} onClick={onCardClick} />)}</div>}
        </div>
      </div>
    </div>
  );
}

// ListingDetailPage
export function ListingDetailPage({ id, onBack, requireAuth, user }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contacted, setContacted] = useState(false);

  useEffect(() => {
    import('../api').then(({ getListing }) =>
      getListing(id).then(r => setListing(r.data.listing)).catch(() => {}).finally(() => setLoading(false))
    );
  }, [id]);

  if (loading) return <div className="spinner">Loading listing...</div>;
  if (!listing) return <div className="empty-state"><div className="empty-icon">😕</div><div>Listing not found</div><button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onBack}>Go Back</button></div>;

  const imgSrc = listing.images && listing.images.length > 0 ? getImageUrl(listing.images[0]) : null;

  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-link" onClick={onBack}>← Back</span>
        <span className="bc-sep">›</span><span>{listing.category}</span>
        <span className="bc-sep">›</span><span>{listing.name}</span>
      </div>
      <div className="layout-flex">
        <div className="flex-1">
          <div className="detail-img">{imgSrc ? <img src={imgSrc} alt={listing.name} /> : <span>{getCategoryIcon(listing.category)}</span>}</div>
          <div className="card card-pad">
            <span className={`badge badge-${listing.type === 'service' ? 'blue' : 'orange'}`} style={{ marginBottom: 10, display: 'inline-block' }}>{listing.type === 'service' ? 'Service' : 'Product'}</span>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700, marginBottom: 10 }}>{listing.name}</h1>
            <div className="detail-price">{formatPrice(listing.price)}{listing.type === 'service' ? '/month' : ''}</div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <div style={{ fontSize: 14, lineHeight: 1.8, color: '#333', whiteSpace: 'pre-line' }}>{listing.detail}</div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <div className="tags">
              <span className="tag">📦 {listing.category}</span>
              {listing.subcategory && <span className="tag">🏷️ {listing.subcategory}</span>}
              <span className="tag">📍 {listing.city}, {listing.state}</span>
              <span className="tag">🌍 {listing.country}</span>
              {listing.area && <span className="tag">🗺️ {listing.area}</span>}
              <span className="tag">👁️ {listing.views} views</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>Posted {timeAgo(listing.createdAt)}</div>
          </div>
        </div>
        <div className="sidebar">
          <div className="seller-box">
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 15 }}>Seller Info</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="avatar-circle">{listing.user?.name?.[0]?.toUpperCase()}</div>
              <div><div style={{ fontWeight: 600 }}>{listing.user?.name}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Verified Seller</div></div>
            </div>
            {contacted ? (
              <>
                <div className="alert alert-success">📞 {listing.user?.phone}</div>
                <div className="alert alert-success" style={{ marginBottom: 0 }}>✉️ {listing.user?.email}</div>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-full" style={{ marginBottom: 8 }} onClick={() => user ? setContacted(true) : requireAuth()}>📞 Show Phone Number</button>
                <button className="btn btn-accent btn-full" onClick={() => user ? setContacted(true) : requireAuth()}>💬 Show Contact Info</button>
                {!user && <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>Login to contact seller</div>}
              </>
            )}
          </div>
          <div className="card card-pad" style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Location</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 2 }}>
              {listing.area && <>{listing.area}<br /></>}{listing.city}, {listing.state}<br />{listing.country}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// MyListingsPage
export function MyListingsPage({ navigate, onCardClick, onPost }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../api').then(({ getMyListings }) =>
      getMyListings().then(r => setListings(r.data.listings)).catch(() => {}).finally(() => setLoading(false))
    );
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    const { deleteListing } = await import('../api');
    await deleteListing(id);
    setListings(l => l.filter(x => x._id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700 }}>My Listings</h1>
        <button className="btn btn-primary" onClick={onPost}>+ Post New Ad</button>
      </div>
      {listings.length > 0 && (
        <div className="stats-row">
          <div className="stat-card"><div className="stat-val">{listings.length}</div><div className="stat-lbl">Total Listings</div></div>
          <div className="stat-card"><div className="stat-val">{listings.filter(l => l.type === 'product').length}</div><div className="stat-lbl">Products</div></div>
          <div className="stat-card"><div className="stat-val">{listings.filter(l => l.type === 'service').length}</div><div className="stat-lbl">Services</div></div>
          <div className="stat-card"><div className="stat-val">{listings.reduce((a, l) => a + (l.views || 0), 0)}</div><div className="stat-lbl">Total Views</div></div>
        </div>
      )}
      {loading ? <div className="spinner">Loading...</div> : listings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div style={{ marginBottom: 16 }}>No listings yet</div>
          <button className="btn btn-primary" onClick={onPost}>Post Your First Ad</button>
        </div>
      ) : (
        <div>
          {listings.map(l => (
            <div key={l._id} className="card" style={{ display: 'flex', marginBottom: 12, overflow: 'hidden' }}>
              <div style={{ width: 120, background: 'linear-gradient(135deg,#f0ebe4,#e2ddd8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, flexShrink: 0 }}>
                {getCategoryIcon(l.category)}
              </div>
              <div style={{ flex: 1, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{l.name}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-head)' }}>{formatPrice(l.price)}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>📍 {l.city} • {l.category} • 👁️ {l.views} views • {timeAgo(l.createdAt)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => onCardClick(l._id)}>View</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
