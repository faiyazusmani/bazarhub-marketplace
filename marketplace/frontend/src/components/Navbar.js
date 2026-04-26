import { useState } from 'react';

export default function Navbar({ user, onAuth, onPost, onLogout, navigate, searchQ, setSearchQ }) {
  const [showDD, setShowDD] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="logo" onClick={() => navigate('home')}>Bazar<span>Hub</span></div>
        <div className="nav-search">
          <span className="nav-search-icon">🔍</span>
          <input
            placeholder="Search products, services, cities..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate('listings', { search: searchQ })}
          />
        </div>
        <div className="nav-actions">
          <span className="nav-link" onClick={() => navigate('listings')}>All Ads</span>
          {user ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={onPost}>+ Post Ad</button>
              <div className="dropdown">
                <div className="user-avatar" onClick={() => setShowDD(d => !d)}>
                  {user.name[0].toUpperCase()}
                </div>
                {showDD && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" style={{ pointerEvents: 'none', paddingBottom: 6 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{user.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="dropdown-item" onClick={() => { navigate('my-listings'); setShowDD(false); }}>📋 My Listings</div>
                    <div className="dropdown-divider" />
                    <div className="dropdown-item" style={{ color: 'var(--danger)' }} onClick={() => { onLogout(); setShowDD(false); }}>🚪 Logout</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={onAuth}>Login</button>
              <button className="btn btn-primary btn-sm" onClick={onPost}>+ Post Ad</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
