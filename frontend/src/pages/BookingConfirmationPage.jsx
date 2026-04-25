import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BmsHeader from '../components/layout/BmsHeader';
import '../styles/bms-theme.css';
import './BookingConfirmationPage.css';

export default function BookingConfirmationPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Data comes from PaymentPage or directly from AiAgent
  const b = location.state?.booking || {};

  const bookingId = b.bookingId  || ('BMS' + Math.floor(Math.random() * 9000000 + 1000000));
  const movie     = b.title      || 'Show';
  const venue     = b.venue      || b.theatreName || 'Cinema';
  const time      = b.time       || b.showTime    || '—';
  const total     = b.total      || b.totalAmount || b.grandTotal || 0;
  const seats     = b.seats      || (b.qty ? Array.from({ length: b.qty }, (_, i) => `${(b.seatTier || 'GEN').slice(0,3).toUpperCase()}-${101 + i}`) : ['A1']);
  const seatTier  = b.seatTier   || b.tier        || '';
  const date      = b.date       || new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const payMethod = b.paymentMethod || '';

  // Save to localStorage if not already saved by PaymentPage
  useEffect(() => {
    if (!b.bookedAt) {
      const booking = {
        bookingId, title: movie, venue, time, seats, seatTier,
        total, date, bookedAt: new Date().toISOString(), paymentMethod: payMethod,
      };
      const existing = JSON.parse(localStorage.getItem('bms_bookings') || '[]');
      if (!existing.find(e => e.bookingId === bookingId)) {
        existing.unshift(booking);
        localStorage.setItem('bms_bookings', JSON.stringify(existing));
      }
    }
  }, []);

  return (
    <div className="bms-home">
      <BmsHeader />
      <div className="bms-container bcon-body">

        <div className="bcon-success-icon">
          <div className="bcon-check-circle"><span>✓</span></div>
          <h1 className="bcon-title">Booking Confirmed!</h1>
          <p className="bcon-subtitle">Your tickets are ready. Enjoy the show! 🎉</p>
        </div>

        <div className="bcon-ticket">
          <div className="bcon-ticket-header">
            <div className="bcon-logo">book<span>my</span>show</div>
            <div className="bcon-booking-id">
              <span className="bcon-booking-label">Booking ID</span>
              <span className="bcon-booking-val">{bookingId}</span>
            </div>
          </div>

          <div className="bcon-ticket-divider">
            <div className="bcon-notch left" />
            <div className="bcon-dashes" />
            <div className="bcon-notch right" />
          </div>

          <div className="bcon-ticket-body">
            <h2 className="bcon-movie-name">{movie}</h2>
            <div className="bcon-details-grid">
              <TicketDetail icon="📍" label="Venue"       value={venue} />
              <TicketDetail icon="📅" label="Date"        value={date} />
              <TicketDetail icon="⏰" label="Show Time"   value={time} />
              {seatTier && <TicketDetail icon="🏷️" label="Category" value={seatTier} />}
              <TicketDetail icon="🪑" label="Seats"       value={seats.join(' • ')} />
              <TicketDetail icon="🎫" label="Tickets"     value={`${seats.length} ticket${seats.length !== 1 ? 's' : ''}`} />
              {payMethod && <TicketDetail icon="💳" label="Paid via" value={payMethod} />}
              <TicketDetail icon="💰" label="Amount Paid" value={`₹${total.toLocaleString('en-IN')}`} highlight />
            </div>
          </div>

          <div className="bcon-ticket-footer">
            <div className="bcon-barcode">
              {Array.from({ length: 32 }, (_, i) => (
                <div key={i} className="bcon-bar"
                  style={{ height: (10 + (i % 7) * 4) + 'px', background: i % 3 === 0 ? '#fff' : '#999' }} />
              ))}
            </div>
            <span className="bcon-barcode-text">{bookingId}</span>
          </div>
        </div>

        <div className="bcon-instructions">
          <h3 className="bcon-inst-title">Important Instructions</h3>
          <ul className="bcon-inst-list">
            <li>📱 Show this confirmation or scan the barcode at the entrance.</li>
            <li>🕐 Arrive at least 15 minutes before the show time.</li>
            <li>🍿 Outside food and beverages are not permitted inside.</li>
            <li>🎟️ Tickets once booked cannot be cancelled or exchanged.</li>
          </ul>
        </div>

        <div className="bcon-actions">
          <button className="bms-btn-red"     onClick={() => navigate('/')}>🎬 Book More Tickets</button>
          <button className="bms-btn-outline" onClick={() => navigate('/bookings')}>📋 My Bookings</button>
          <button className="bms-btn-outline" onClick={() => window.print()}>🖨️ Print Ticket</button>
        </div>

      </div>
    </div>
  );
}

function TicketDetail({ icon, label, value, highlight }) {
  return (
    <div className={`bcon-detail${highlight ? ' highlight' : ''}`}>
      <span className="bcon-detail-icon">{icon}</span>
      <div>
        <span className="bcon-detail-label">{label}</span>
        <span className="bcon-detail-value">{value}</span>
      </div>
    </div>
  );
}
