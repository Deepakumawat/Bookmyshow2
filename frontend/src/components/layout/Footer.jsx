import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        borderTop: `1px solid var(--border)`,
        marginTop: 60,
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Main Footer Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Company Info */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 700 }}>
              🎬 BookMyShow
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your ultimate destination for booking movie tickets, event tickets, and more. Experience entertainment like never before.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <a href="#" style={{ fontSize: 20, cursor: 'pointer' }}>📘</a>
              <a href="#" style={{ fontSize: 20, cursor: 'pointer' }}>🐦</a>
              <a href="#" style={{ fontSize: 20, cursor: 'pointer' }}>📷</a>
              <a href="#" style={{ fontSize: 20, cursor: 'pointer' }}>▶️</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700 }}>Quick Links</h4>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {[
                { label: 'About Us', href: '#' },
                { label: 'Contact Us', href: '#' },
                { label: 'FAQs', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Blog', href: '#' },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: 8 }}>
                  <a
                    href={item.href}
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: 13,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Booking & Support */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700 }}>Booking & Support</h4>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {[
                { label: 'How to Book', href: '#' },
                { label: 'Payment Methods', href: '#' },
                { label: 'Refund Policy', href: '#' },
                { label: 'Cancellation', href: '#' },
                { label: 'Live Chat', href: '#' },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: 8 }}>
                  <a
                    href={item.href}
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: 13,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Apps */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700 }}>Download App</h4>
            <p style={{ margin: '0 0 12px 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Get better experience with our mobile app
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                style={{
                  padding: '10px 16px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--primary)';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--bg-secondary)';
                  e.target.style.color = 'var(--text-primary)';
                  e.target.style.borderColor = 'var(--border)';
                }}
              >
                📱 iOS App
              </button>
              <button
                style={{
                  padding: '10px 16px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--primary)';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--bg-secondary)';
                  e.target.style.color = 'var(--text-primary)';
                  e.target.style.borderColor = 'var(--border)';
                }}
              >
                🤖 Android App
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 24,
            marginBottom: 40,
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 700 }}>
            Subscribe to Our Newsletter
          </h4>
          <p style={{ margin: '0 0 16px 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Get exclusive offers, movie updates, and special deals delivered to your inbox
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '10px 16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 13,
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
              }}
            />
            <button
              style={{
                padding: '10px 24px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
            © 2024 BookMyShow Advanced. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: 24, fontSize: 12 }}>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Terms of Service
            </a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
