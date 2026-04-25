import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BmsHeader from '../components/layout/BmsHeader';
import '../styles/bms-theme.css';
import './BookingHistoryPage.css';

function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem('bms_bookings') || '[]');
  } catch {
    return [];
  }
}

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(loadBookings());
  }, []);

  const now = new Date();

  const filtered = bookings.filter(b => {
    if (tab === 'all') return true;
    // treat bookings less than 3 hours old as upcoming (approx)
    const age = (now - new Date(b.bookedAt)) / 3600000;
    if (tab === 'upcoming')  return age < 3;
    if (tab === 'completed') return age >= 3;
    return true;
  });

  return (
    <div className="bms-home">
      <BmsHeader />

      <div className="bh-hero">
        <div className="bms-container">
          <h1 className="bh-hero-title">My Bookings</h1>
          <p className="bh-hero-sub">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="bms-container bh-body">
        <div className="bh-tabs">
          {[['all', 'All'], ['upcoming', 'Recent'], ['completed', 'Older']].map(([id, label]) => (
            <button
              key={id}
              className={`bh-tab${tab === id ? ' active' : ''}`}
              onClick={() => setTab(id)}
            >{label} {id === 'all' ? `(${bookings.length})` : ''}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bh-empty">
            <div className="bh-empty-icon">🎟️</div>
            <h3>No bookings yet</h3>
            <p>Your confirmed tickets will appear here</p>
            <button className="bms-btn-red" onClick={() => navigate('/')}>Browse Shows</button>
          </div>
        ) : (
          <div className="bh-list">
            {filtered.map((b, idx) => (
              <BookingCard key={b.bookingId || idx} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking: b }) {
  const bookedDate = new Date(b.bookedAt);
  const isRecent   = (new Date() - bookedDate) < 3 * 3600000;

  return (
    <div className="bh-card">
      <div className="bh-card-left">
        <div className="bh-card-img">🎬</div>
      </div>
      <div className="bh-card-body">
        <div className="bh-card-top">
          <div>
            <div className="bh-card-title">{b.title}</div>
            <div className="bh-card-sub">{b.venue}</div>
          </div>
          <span className={`bh-badge${isRecent ? ' upcoming' : ' done'}`}>
            {isRecent ? 'Recent' : 'Confirmed'}
          </span>
        </div>
        <div className="bh-card-meta">
          {b.time  && <span>⏰ {b.time}</span>}
          {b.date  && <span>📅 {b.date}</span>}
          {b.seats?.length > 0 && <span>🪑 {b.seats.slice(0, 4).join(', ')}{b.seats.length > 4 ? ` +${b.seats.length - 4}` : ''}</span>}
          {b.seatTier && <span>🏷️ {b.seatTier}</span>}
        </div>
        <div className="bh-card-footer">
          <div className="bh-card-id">ID: {b.bookingId}</div>
          <div className="bh-card-total">₹{b.total?.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
}
