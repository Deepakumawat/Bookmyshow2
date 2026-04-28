import { useState, useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';
import BmsHeader from '../components/layout/BmsHeader';
import '../styles/bms-theme.css';

const DEFAULT_NOTIFICATIONS = [
  { id: 1, type: 'booking', title: 'Booking Confirmed', message: 'Your tickets for KGF Chapter 3 have been booked successfully', time: '2 hours ago', read: false, icon: '✅' },
  { id: 2, type: 'offer', title: 'Special Offer!', message: 'Get 30% off on your next booking using code SPECIAL30', time: '5 hours ago', read: false, icon: '🎉' },
  { id: 3, type: 'reminder', title: 'Movie Reminder', message: 'Don\'t miss "Pushpa 2" showing at PVR near you tonight!', time: '1 day ago', read: true, icon: '🎬' },
  { id: 4, type: 'loyalty', title: 'Points Earned', message: 'You earned 300 loyalty points from your last booking', time: '2 days ago', read: true, icon: '⭐' },
  { id: 5, type: 'offer', title: 'Weekend Special', message: 'Book any 2 tickets this weekend and get free popcorn!', time: '3 days ago', read: true, icon: '🍿' },
];

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'booking', label: 'Bookings' },
  { id: 'offer', label: 'Offers' },
  { id: 'reminder', label: 'Reminders' },
  { id: 'loyalty', label: 'Loyalty' },
];

export default function NotificationsPage() {
  const { notifications: ctx, markAsRead, markAllAsRead, deleteNotification, addNotification } = useNotification();
  const [tab, setTab] = useState('all');
  const seeded = useRef(false);

  useEffect(() => {
    if (!seeded.current && ctx.length === 0) {
      seeded.current = true;
      DEFAULT_NOTIFICATIONS.forEach(n =>
        addNotification({ type: n.type, title: n.title, message: n.message, icon: n.icon, priority: 'medium' })
      );
    }
  }, []);

  const list = ctx.length > 0 ? ctx : DEFAULT_NOTIFICATIONS;
  const filtered = tab === 'all' ? list : list.filter(n => n.type === tab);
  const unread = list.filter(n => !n.read).length;

  return (
    <div className="bms-home">
      <BmsHeader />

      <div className="bms-container" style={{ padding: '24px 16px' }}>
        {/* Page title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ color: 'var(--bms-text)', margin: 0, fontSize: 22 }}>📬 Notifications</h2>
            {unread > 0 && (
              <p style={{ color: 'var(--bms-text-muted)', margin: '4px 0 0', fontSize: 14 }}>
                {unread} unread notification{unread !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unread > 0 && (
            <button className="bms-btn-red" style={{ fontSize: 13, padding: '8px 16px' }} onClick={markAllAsRead}>
              Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: tab === t.id ? '#cc0000' : 'var(--bms-card)',
                color: tab === t.id ? 'white' : 'var(--bms-text-muted)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--bms-text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p>No notifications here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(n => (
              <div
                key={n.id}
                style={{
                  background: 'var(--bms-card)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  borderLeft: n.read ? '3px solid transparent' : '3px solid #cc0000',
                  opacity: n.read ? 0.7 : 1,
                }}
              >
                <div style={{ fontSize: 28, lineHeight: 1 }}>{n.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--bms-text)', fontWeight: 600, marginBottom: 4 }}>{n.title}</div>
                  <div style={{ color: 'var(--bms-text-muted)', fontSize: 14, marginBottom: 6 }}>{n.message}</div>
                  <div style={{ color: 'var(--bms-text-muted)', fontSize: 12 }}>{n.time || n.timestamp}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      title="Mark as read"
                      style={{ background: 'none', border: '1px solid #22c55e', color: '#22c55e', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 13 }}
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    title="Delete"
                    style={{ background: 'none', border: '1px solid #cc0000', color: '#cc0000', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 13 }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
