import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './BmsHeader.css';

const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Nagpur', 'Indore', 'Bhopal', 'Chandigarh',
  'Kochi', 'Patna', 'Ranchi', 'Bhubaneswar', 'Guwahati',
];

const NAV_TABS = ['Movies', 'Stream', 'Events', 'Plays', 'Sports', 'Activities'];

export default function BmsHeader({ activeTab = 'Movies', onTabChange }) {
  const navigate = useNavigate();
  const [city, setCity] = useState(() => localStorage.getItem('bms_city') || 'Jaipur');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(() => AuthService.getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cityRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (cityRef.current && !cityRef.current.contains(e.target)) setShowCityDropdown(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCitySelect = (c) => {
    setCity(c);
    localStorage.setItem('bms_city', c);
    setShowCityDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bms-header">
      <div className="bms-header-top">
        <div className="bms-container bms-header-inner">
          {/* Logo */}
          <div className="bms-logo" onClick={() => navigate('/')}>
            <span className="bms-logo-text">book<span>my</span>show</span>
          </div>

          {/* Search */}
          <form className="bms-search-wrap" onSubmit={handleSearch}>
            <span className="bms-search-icon">🔍</span>
            <input
              className="bms-search-input"
              placeholder="Search for Movies, Events, Plays, Sports and Activities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Right: city + auth */}
          <div className="bms-header-right">
            {/* City selector */}
            <div className="bms-city-wrap" ref={cityRef}>
              <button
                className="bms-city-btn"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
              >
                <span className="bms-city-pin">📍</span>
                <span className="bms-city-name">{city}</span>
                <span className="bms-city-arrow">{showCityDropdown ? '▲' : '▼'}</span>
              </button>
              {showCityDropdown && (
                <div className="bms-city-dropdown">
                  <div className="bms-city-dropdown-title">Popular Cities</div>
                  <div className="bms-city-popular">
                    {CITIES.slice(0, 8).map((c) => (
                      <div key={c} className={`bms-city-chip${city === c ? ' active' : ''}`} onClick={() => handleCitySelect(c)}>
                        {c}
                      </div>
                    ))}
                  </div>
                  <div className="bms-city-dropdown-title" style={{ marginTop: 6 }}>More Cities</div>
                  {CITIES.slice(8).map((c) => (
                    <div key={c} className={`bms-city-option${city === c ? ' active' : ''}`} onClick={() => handleCitySelect(c)}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {user ? (
              <div className="bms-user-wrap" ref={userRef}>
                <button
                  className="bms-user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="bms-user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                  <span className="bms-user-name">{user.name?.split(' ')[0]}</span>
                </button>
                {showUserMenu && (
                  <div className="bms-user-menu">
                    <div className="bms-user-menu-header">
                      <div className="bms-user-avatar lg">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                      <div>
                        <div className="bms-user-menu-name">{user.name}</div>
                        <div className="bms-user-menu-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="bms-user-menu-divider" />
                    <div className="bms-user-menu-item" onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>👤 My Profile</div>
                    <div className="bms-user-menu-item" onClick={() => { navigate('/bookings'); setShowUserMenu(false); }}>🎟️ My Bookings</div>
                    <div className="bms-user-menu-divider" />
                    <div className="bms-user-menu-item logout" onClick={handleLogout}>🚪 Sign Out</div>
                  </div>
                )}
              </div>
            ) : (
              <button className="bms-signin-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="bms-header-nav">
        <div className="bms-container bms-nav-inner">
          {NAV_TABS.map((tab) => (
            <button
              key={tab}
              className={`bms-nav-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => onTabChange ? onTabChange(tab) : navigate('/?tab=' + tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
