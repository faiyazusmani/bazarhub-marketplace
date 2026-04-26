import { useState, useEffect } from 'react';
import { getListings, getStats } from '../api';
import ListingCard from '../components/ListingCard';
import { getCategoryIcon } from '../utils';

const CATEGORIES = ['Electronics','Vehicles','Property','Jobs','Furniture','Fashion','Services','Sports'];

export default function HomePage({ navigate, searchQ, onCardClick }) {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({ cityStats: [], catStats: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = searchQ ? { search: searchQ, limit: 12 } : { limit: 9 };
    Promise.all([getListings(params), getStats()])
      .then(([lr, sr]) => { setListings(lr.data.listings); setStats(sr.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchQ]);

  const catCount = {};
  stats.catStats.forEach(s => { catCount[s._id] = s.count; });
  const cities = stats.cityStats.slice(0, 6);

  return (
    <>
      {!searchQ && (
        <>
          <div className="hero">
            <h1>Buy, Sell & Discover Near You</h1>
            <p>India's growing marketplace — post your ad and reach thousands of buyers</p>
            <div className="hero-search">
              <input placeholder="What are you looking for?" onKeyDown={e => e.key === 'Enter' && navigate('listings', { search: e.target.value })} />
              <button onClick={() => navigate('listings')}>Search</button>
            </div>
          </div>

          <div className="section-title">Browse Categories</div>
          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <div key={cat} className="cat-card" onClick={() => navigate('category', { category: cat })}>
                <span className="cat-icon">{getCategoryIcon(cat)}</span>
                <div className="cat-info">
                  <div className="cat-name">{cat}</div>
                  <div className="cat-count">{catCount[cat] || 0} listings</div>
                </div>
              </div>
            ))}
          </div>

          {cities.length > 0 && (
            <>
              <div className="section-title">Popular Cities</div>
              <div className="city-grid">
                {cities.map(c => (
                  <div key={c._id.city} className="city-card" onClick={() => navigate('listings', { city: c._id.city })}>
                    <div className="city-emoji">🏙️</div>
                    <div className="city-name">{c._id.city}</div>
                    <div className="city-count">{c.count} listing{c.count !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          {searchQ ? `Results for "${searchQ}"` : 'Recent Listings'}
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('listings')}>View All</button>
      </div>

      {loading ? (
        <div className="spinner">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🔍</div><div>No listings found</div></div>
      ) : (
        <div className="listing-grid">
          {listings.map(l => <ListingCard key={l._id} listing={l} onClick={onCardClick} />)}
        </div>
      )}
    </>
  );
}
