import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { notificationTemplates, notificationTypes } from '../data/notificationTemplates';
import './NotificationSettingsPage.css';

function NotificationSettingsPage() {
  const { preferences, updatePreference, updateAllPreferences } = useNotification();
  const { theme } = useTheme();
  const [savedMessage, setSavedMessage] = useState(false);

  const isDark = theme === 'dark';

  const handleToggle = (notificationType, channel) => {
    updatePreference(notificationType, channel, !preferences[notificationType][channel]);
    showSavedMessage();
  };

  const handleToggleAll = (notificationType) => {
    const currentState = preferences[notificationType];
    const allEnabled = Object.values(currentState).every((v) => v === true);
    updateAllPreferences(notificationType, !allEnabled);
    showSavedMessage();
  };

  const showSavedMessage = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const notificationTypesList = Object.entries(notificationTypes);

  return (
    <div className={`notification-settings-page ${isDark ? '' : 'light'}`}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
          padding: '20px 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, color: 'white', fontSize: 28, fontWeight: 700 }}>🔔 Notification Settings</h1>
        <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
          Manage how you receive notifications
        </p>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        {/* Saved Message */}
        {savedMessage && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 8,
              padding: 12,
              marginBottom: 24,
              color: 'rgb(16, 185, 129)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            ✓ Preferences saved successfully
          </div>
        )}

        {/* Introduction */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 32,
          }}
        >
          <h2 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 700 }}>
            Manage Your Notification Preferences
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Choose how you want to receive notifications about your bookings, payments, loyalty rewards, and special offers.
            You can enable or disable notifications for each category and channel.
          </p>
        </div>

        {/* Notification Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {notificationTypesList.map(([key, type]) => {
            const template = notificationTemplates[type];
            if (!template) return null;

            const currentPrefs = preferences[type];
            const allEnabled = Object.values(currentPrefs).every((v) => v === true);
            const someEnabled = Object.values(currentPrefs).some((v) => v === true);

            return (
              <div
                key={type}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 20,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 24 }}>{template.icon}</span>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{template.title}</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                      {template.description}
                    </p>
                  </div>

                  {/* Master Toggle */}
                  <button
                    onClick={() => handleToggleAll(type)}
                    style={{
                      padding: '8px 16px',
                      background: allEnabled ? 'var(--primary)' : 'var(--bg-primary)',
                      color: allEnabled ? 'white' : 'var(--text-secondary)',
                      border: `1px solid ${allEnabled ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {allEnabled ? '✓ All Enabled' : someEnabled ? '◐ Partial' : '○ All Disabled'}
                  </button>
                </div>

                {/* Channel Toggles */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 12,
                  }}
                >
                  {[
                    { id: 'email', label: '📧 Email', icon: '📧' },
                    { id: 'sms', label: '💬 SMS', icon: '💬' },
                    { id: 'push', label: '📲 Push', icon: '📲' },
                    { id: 'inApp', label: '🔔 In-App', icon: '🔔' },
                  ].map((channel) => (
                    <label
                      key={channel.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'var(--bg-primary)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: `1px solid ${currentPrefs[channel.id] ? 'var(--primary)' : 'var(--border)'}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark ? '#2a2a3e' : '#f0f0f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--bg-primary)';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={currentPrefs[channel.id]}
                        onChange={() => handleToggle(type, channel.id)}
                        style={{
                          accentColor: 'var(--primary)',
                          cursor: 'pointer',
                          width: 16,
                          height: 16,
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{channel.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            background: 'rgba(96, 165, 250, 0.1)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: 12,
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#60A5FA' }}>
            💡 Important Information:
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Critical notifications (Payment Failed, Booking Reminder) are always sent to at least one channel</li>
            <li>Check your email spam folder if you don't receive email notifications</li>
            <li>SMS notifications require a valid phone number in your profile</li>
            <li>Push notifications work on browsers that support the Notifications API</li>
            <li>Changes are saved automatically</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default NotificationSettingsPage;
