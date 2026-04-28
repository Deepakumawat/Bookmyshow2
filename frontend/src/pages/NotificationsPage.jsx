import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import './NotificationsPage.css';

const DEFAULT_NOTIFICATIONS = [
  { id: 1, type: 'booking', title: 'Booking Confirmation', message: 'Your tickets for KGF Chapter 3 have been booked successfully', timestamp: '2 hours ago', read: false, icon: '✅' },
  { id: 2, type: 'offer', title: 'Special Offer Available', message: 'Get 30% off on your next booking using code SPECIAL30', timestamp: '5 hours ago', read: false, icon: '🎉' },
  { id: 3, type: 'reminder', title: 'Upcoming Movie Reminder', message: 'Don\'t miss "Pushpa 2" showing at PVR near you tonight!', timestamp: '1 day ago', read: true, icon: '🎬' },
  { id: 4, type: 'loyalty', title: 'Points Earned', message: 'You earned 300 loyalty points from your last booking', timestamp: '2 days ago', read: true, icon: '⭐' },
  { id: 5, type: 'offer', title: 'Weekend Special', message: 'Book any 2 tickets this weekend and get free popcorn!', timestamp: '3 days ago', read: true, icon: '🍿' },
];

export default function NotificationsPage() {
  const { isDark } = useContext(ThemeContext);
  const { notifications: ctxNotifications, markAsRead, markAllAsRead, deleteNotification: ctxDelete, addNotification } = useNotification();

  // Seed defaults only once if context is empty
  useEffect(() => {
    if (ctxNotifications.length === 0) {
      DEFAULT_NOTIFICATIONS.forEach(n => addNotification({ type: n.type, title: n.title, message: n.message, icon: n.icon, priority: 'medium' }));
    }
  }, []);

  const notifications = ctxNotifications.length > 0 ? ctxNotifications : DEFAULT_NOTIFICATIONS;
  const deleteNotification = ctxDelete;

  const [selectedTab, setSelectedTab] = useState('all');
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingUpdates: true,
    offerAlerts: true,
    reminderEmails: true,
    loyaltyUpdates: true,
  });

  const filteredNotifications = selectedTab === 'all'
    ? notifications
    : notifications.filter((n) => n.type === selectedTab);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`notifications-page ${isDark ? '' : 'light'}`}>
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <div>
            <h1>📬 Notifications</h1>
            {unreadCount > 0 && (
              <p className="unread-count">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="btn-mark-all-read" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-content">
          {/* Sidebar with Preferences */}
          <aside className="notifications-sidebar">
            <h3>Notification Settings</h3>

            <div className="preferences-section">
              <h4>Channel Preferences</h4>
              <div className="preference-group">
                <label className="preference-checkbox">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: e.target.checked,
                      })
                    }
                  />
                  <span>📧 Email</span>
                </label>
                <label className="preference-checkbox">
                  <input
                    type="checkbox"
                    checked={preferences.smsNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        smsNotifications: e.target.checked,
                      })
                    }
                  />
                  <span>💬 SMS</span>
                </label>
                <label className="preference-checkbox">
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        pushNotifications: e.target.checked,
                      })
                    }
                  />
                  <span>🔔 Push</span>
                </label>
              </div>
            </div>

            <div className="preferences-section">
              <h4>Notification Types</h4>
              <div className="preference-group">
                <label className="preference-checkbox">
                  <input
                    type="checkbox"
                    checked={preferences.bookingUpdates}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        bookingUpdates: e.target.checked,
                      })
                    }
                  />
                  <span>Booking Updates</span>
                </label>
                <label className="preference-checkbox">
                  <input
                    type="checkbox"
                    checked={preferences.offerAlerts}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        offerAlerts: e.target.checked,
                      })
                    }
                  />
                  <span>Offers & Promotions</span>
                </label>
                <label className="preference-checkbox">
                  <input
                    type="checkbox"
                    checked={preferences.reminderEmails}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        reminderEmails: e.target.checked,
                      })
                    }
                  />
                  <span>Reminders</span>
                </label>
                <label className="preference-checkbox">
                  <input
                    type="checkbox"
                    checked={preferences.loyaltyUpdates}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        loyaltyUpdates: e.target.checked,
                      })
                    }
                  />
                  <span>Loyalty Points</span>
                </label>
              </div>
            </div>

            <button className="btn-save-preferences">💾 Save Preferences</button>
          </aside>

          {/* Main Notifications Area */}
          <main className="notifications-main">
            {/* Tabs */}
            <div className="notification-tabs">
              <button
                className={`tab-btn ${selectedTab === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedTab('all')}
              >
                All ({notifications.length})
              </button>
              <button
                className={`tab-btn ${selectedTab === 'booking' ? 'active' : ''}`}
                onClick={() => setSelectedTab('booking')}
              >
                Bookings
              </button>
              <button
                className={`tab-btn ${selectedTab === 'offer' ? 'active' : ''}`}
                onClick={() => setSelectedTab('offer')}
              >
                Offers
              </button>
              <button
                className={`tab-btn ${selectedTab === 'reminder' ? 'active' : ''}`}
                onClick={() => setSelectedTab('reminder')}
              >
                Reminders
              </button>
              <button
                className={`tab-btn ${selectedTab === 'loyalty' ? 'active' : ''}`}
                onClick={() => setSelectedTab('loyalty')}
              >
                Loyalty
              </button>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
              {filteredNotifications.length === 0 ? (
                <div className="empty-notifications">
                  <div className="empty-icon">📭</div>
                  <h3>No notifications</h3>
                  <p>You're all caught up! Check back later for updates.</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-card ${notif.read ? 'read' : 'unread'}`}
                  >
                    <div className="notification-icon">{notif.icon}</div>

                    <div className="notification-content">
                      <h4 className="notification-title">{notif.title}</h4>
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">{notif.timestamp}</span>
                    </div>

                    <div className="notification-actions">
                      {!notif.read && (
                        <button
                          className="action-btn mark-read"
                          onClick={() => markAsRead(notif.id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="action-btn delete"
                        onClick={() => deleteNotification(notif.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
