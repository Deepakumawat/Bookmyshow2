import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { UserContext } from '../../context/UserContext';
import { NotificationContext } from '../../context/NotificationContext';
import './EnhancedHeader.css';

export function EnhancedHeader() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(UserContext);
  const { notifications = [] } = useContext(NotificationContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`enhanced-header ${isDark ? 'dark' : 'light'}`}>
      <div className="header-container">
        {/* Logo & Brand */}
        <div className="header-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">🎬</span>
          <span className="logo-text">BookMyShow</span>
        </div>

        {/* Search Bar */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Search movies, events..."
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>

        {/* Navigation Links */}
        <nav className="header-nav">
          <button className="nav-link" onClick={() => navigate('/')}>Home</button>
          <button className="nav-link" onClick={() => navigate('/theatres')}>Theatres</button>
          <button className="nav-link" onClick={() => navigate('/offers')}>Offers</button>
          {user?.isLoggedIn && <button className="nav-link" onClick={() => navigate('/bookings')}>My Bookings</button>}
        </nav>

        {/* Right Side Actions */}
        <div className="header-actions">
          {/* Loyalty Status */}
          {user?.isLoggedIn && (
            <div className="loyalty-badge">
              <span className="badge-icon">⭐</span>
              <span className="badge-text">Gold</span>
            </div>
          )}

          {/* Notifications */}
          <div className="notification-icon-wrapper">
            <button
              className="notification-icon"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <button onClick={() => setShowNotifications(false)}>✕</button>
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map(notif => (
                      <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                        <span className="notif-icon">{notif.icon}</span>
                        <div className="notif-content">
                          <p className="notif-title">{notif.title}</p>
                          <p className="notif-message">{notif.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">No new notifications</p>
                  )}
                </div>
                <button className="view-all-btn" onClick={() => navigate('/notifications')}>
                  View All →
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* User Menu */}
          {user?.isLoggedIn ? (
            <div className="user-menu-wrapper">
              <button
                className="user-menu-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="user-avatar">{user.name?.charAt(0) || '👤'}</span>
              </button>

              {showDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="dropdown-links">
                    <button onClick={() => { navigate('/profile'); setShowDropdown(false); }}>👤 Profile</button>
                    <button onClick={() => { navigate('/loyalty'); setShowDropdown(false); }}>⭐ Loyalty</button>
                    <button onClick={() => { navigate('/bookings'); setShowDropdown(false); }}>🎫 My Bookings</button>
                    <button onClick={() => { navigate('/wishlist'); setShowDropdown(false); }}>❤️ Wishlist</button>
                    <button onClick={() => { navigate('/settings/payments'); setShowDropdown(false); }}>💳 Payments</button>
                    <button onClick={() => { navigate('/settings/notifications'); setShowDropdown(false); }}>🔔 Notifications</button>
                  </div>
                  <hr />
                  <div className="dropdown-footer">
                    <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
              <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default EnhancedHeader;
