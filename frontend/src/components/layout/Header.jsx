import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import AuthService from '../../services/AuthService';
import { NotificationCenter } from '../notifications/NotificationCenter';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  const isDark = theme === 'dark';

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserMenuOpen(false);
    window.location.href = '/';
  };

  const userMenuItemsWithLogout = [
    { label: '👤 Profile', href: '/profile' },
    { label: '💝 Wishlist', href: '/wishlist' },
    { label: '⭐ Loyalty Program', href: '/loyalty' },
    { label: '📬 Notifications', href: '/notifications' },
    { label: '⚙️ Settings', href: '/settings/payments' },
    { label: '🔔 Notification Settings', href: '/settings/notifications' },
    { label: '🗺️ User Journey', href: '/journey' },
    { label: '📋 Help', href: '/' },
    { label: '🚪 Logout', action: handleLogout },
  ];

  const navLinks = [
    { label: 'Movies', href: '/' },
    { label: 'Events', href: '/' },
    { label: 'Offers', href: '/offers' },
    { label: 'My Bookings', href: '/bookings' },
  ];

  const userMenuItems = [
    { label: '👤 Profile', href: '/profile' },
    { label: '💝 Wishlist', href: '/wishlist' },
    { label: '⭐ Loyalty Program', href: '/loyalty' },
    { label: '📬 Notifications', href: '/notifications' },
    { label: '⚙️ Settings', href: '/settings/payments' },
    { label: '🔔 Notification Settings', href: '/settings/notifications' },
    { label: '🗺️ User Journey', href: '/journey' },
    { label: '📋 Help', href: '/' },
  ];

  return (
    <header
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        borderBottom: `1px solid var(--border)`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
            gap: 20,
          }}
        >
          {/* Logo */}
          <div
            onClick={() => window.location.href = '/'}
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🎬 BookMyShow
          </div>

          {/* Search Bar */}
          <div
            style={{
              flex: 1,
              maxWidth: '400px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 16px',
            }}
          >
            <input
              type="text"
              placeholder="Search movies, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/?search=${searchQuery}`;
                }
              }}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 14,
                color: 'var(--text-primary)',
              }}
            />
            <span style={{ fontSize: 18, cursor: 'pointer' }}>🔍</span>
          </div>

          {/* Navigation Links - Desktop */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              alignItems: 'center',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'color 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--text-primary)';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side Icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
                padding: 8,
                borderRadius: 8,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = isDark ? '#2a2a3e' : '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Login/Signup Buttons - Only show if not authenticated */}
            {!isAuthenticated && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <a
                  href="/login"
                  style={{
                    padding: '8px 16px',
                    border: `2px solid var(--primary)`,
                    borderRadius: 6,
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  style={{
                    padding: '8px 16px',
                    background: 'var(--primary)',
                    borderRadius: 6,
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  Sign Up
                </a>
              </div>
            )}

            {/* Notification Bell - Only show if authenticated */}
            {isAuthenticated && <NotificationCenter />}

            {/* User Menu Dropdown - Only show if authenticated */}
            {isAuthenticated && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: 20,
                    cursor: 'pointer',
                    padding: 8,
                    borderRadius: 8,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? '#2a2a3e' : '#e0e0e0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  title="User Account"
                >
                  👤
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      minWidth: '180px',
                      marginTop: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 200,
                    }}
                  >
                    {userMenuItemsWithLogout.map((item) => (
                      item.action ? (
                        <button
                          key={item.label}
                          onClick={() => {
                            item.action();
                          }}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '12px 16px',
                            color: 'var(--text-primary)',
                            background: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            fontSize: 14,
                            fontWeight: 500,
                            borderBottom: '1px solid var(--border)',
                            transition: 'background 0.2s ease',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-light)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'block',
                            padding: '12px 16px',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            fontSize: 14,
                            fontWeight: 500,
                            borderBottom: '1px solid var(--border)',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-light)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {item.label}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              display: 'none',
              '@media': {
                'max-width: 768px': {
                  display: 'block',
                },
              },
            }}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: '16px 0',
              borderTop: '1px solid var(--border)',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '8px 0',
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8 }}>
              {userMenuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    display: 'block',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 500,
                    padding: '8px 0',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
