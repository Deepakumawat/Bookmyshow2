import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, deleteNotification, markAllAsRead } = useNotification();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'transparent',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          padding: 8,
          borderRadius: 8,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDark ? '#2a2a3e' : '#f0f0f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: '#FF4757',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              border: '2px solid var(--bg-primary)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            width: 360,
            maxHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  style={{
                    padding: 16,
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: notification.read ? 'transparent' : 'var(--primary)' + '10',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? '#2a2a3e' : '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.read ? 'transparent' : 'var(--primary)' + '10';
                  }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 20, minWidth: 24 }}>{notification.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: 13, fontWeight: 600 }}>
                        {notification.title}
                      </p>
                      <p style={{ margin: '0 0 6px 0', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {notification.message}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
                        {new Date(notification.timestamp).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: 14,
                        padding: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p style={{ margin: 0, fontSize: 14 }}>No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border)',
                textAlign: 'center',
              }}
            >
              <a
                href="/notifications"
                style={{
                  color: 'var(--primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                View All Notifications →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
}
