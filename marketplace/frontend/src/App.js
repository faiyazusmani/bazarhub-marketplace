import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CityPage from './pages/CityPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import MyListingsPage from './pages/MyListingsPage';
import AuthModal from './components/AuthModal';
import PostModal from './components/PostModal';
import './App.css';

function AppInner() {
  const { user, logoutUser } = useAuth();
  const [page, setPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [showAuth, setShowAuth] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  const navigate = useCallback((p, params = {}) => {
    setPage(p);
    setPageParams(params);
    setSearchQ('');
    window.scrollTo(0, 0);
  }, []);

  const requireAuth = (action) => {
    if (!user) { setShowAuth(true); return false; }
    action();
    return true;
  };

  const renderPage = () => {
    if (page === 'listing-detail') return <ListingDetailPage id={pageParams.id} onBack={() => navigate(pageParams.from || 'home')} requireAuth={() => setShowAuth(true)} user={user} />;
    if (page === 'category') return <CategoryPage category={pageParams.category} navigate={navigate} onCardClick={(id) => navigate('listing-detail', { id, from: 'category' })} />;
    if (page === 'city') return <CityPage city={pageParams.city} navigate={navigate} onCardClick={(id) => navigate('listing-detail', { id, from: 'city' })} />;
    if (page === 'listings') return <ListingsPage city={pageParams.city} category={pageParams.category} navigate={navigate} onCardClick={(id) => navigate('listing-detail', { id, from: 'listings' })} />;
    if (page === 'my-listings') return <MyListingsPage navigate={navigate} onCardClick={(id) => navigate('listing-detail', { id, from: 'my-listings' })} onPost={() => setShowPost(true)} />;
    return <HomePage navigate={navigate} searchQ={searchQ} onCardClick={(id) => navigate('listing-detail', { id, from: 'home' })} />;
  };

  return (
    <div className="app">
      <Navbar
        user={user}
        onAuth={() => setShowAuth(true)}
        onPost={() => requireAuth(() => setShowPost(true))}
        onLogout={logoutUser}
        navigate={navigate}
        searchQ={searchQ}
        setSearchQ={setSearchQ}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showPost && user && <PostModal onClose={() => setShowPost(false)} onSuccess={() => { setShowPost(false); navigate('my-listings'); }} />}
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
