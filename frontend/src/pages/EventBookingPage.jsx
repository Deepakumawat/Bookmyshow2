import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BmsHeader from '../components/layout/BmsHeader';
import '../styles/bms-theme.css';
import './EventBookingPage.css';

const CONVENIENCE_FEE_PER_TICKET = 30;

const SEAT_TIERS = {
  sport: [
    { id: 'vip',      label: 'VIP Box',       color: '#e41b32', icon: '👑', desc: 'Best view, premium lounge access' },
    { id: 'gold',     label: 'Grand Stand',    color: '#f39c12', icon: '⭐', desc: 'Excellent sightlines, covered seating' },
    { id: 'silver',   label: 'Pavilion',       color: '#2980b9', icon: '🎟️', desc: 'Great atmosphere, open stand' },
    { id: 'general',  label: 'General Stand',  color: '#27ae60', icon: '🏟️', desc: 'Budget-friendly, join the crowd' },
  ],
  event: [
    { id: 'vip',      label: 'VIP / Backstage', color: '#e41b32', icon: '👑', desc: 'Front row + artist meet & greet' },
    { id: 'gold',     label: 'Premium',          color: '#f39c12', icon: '⭐', desc: 'Reserved seating, best sound zone' },
    { id: 'silver',   label: 'Standard',         color: '#2980b9', icon: '🎟️', desc: 'Great view, comfortable standing' },
    { id: 'general',  label: 'General',          color: '#27ae60', icon: '🎶', desc: 'Budget-friendly general admission' },
  ],
  play: [
    { id: 'vip',      label: 'Royal Circle',    color: '#8e44ad', icon: '👑', desc: 'Premium front-centre seats' },
    { id: 'gold',     label: 'Dress Circle',    color: '#f39c12', icon: '⭐', desc: 'Elevated prime view' },
    { id: 'silver',   label: 'Stalls',          color: '#2980b9', icon: '🎭', desc: 'Ground floor seating' },
    { id: 'general',  label: 'Upper Circle',    color: '#27ae60', icon: '🎟️', desc: 'Budget balcony seating' },
  ],
};

export default function EventBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item, type = 'event', image } = location.state || {};

  const [selectedTier, setSelectedTier] = useState(null);
  const [qty, setQty] = useState(1);
  const [booking, setBooking] = useState(false);

  if (!item) {
    return (
      <div className="bms-home">
        <BmsHeader />
        <div className="eb-not-found">
          <span>🎟️</span>
          <h2>No event selected</h2>
          <button className="bms-btn-red" onClick={() => navigate('/')}>Browse Events</button>
        </div>
      </div>
    );
  }

  const tiers = SEAT_TIERS[type] || SEAT_TIERS.event;

  // Build price map from item.price range
  const minPrice = item.price?.min ?? 300;
  const maxPrice = item.price?.max ?? minPrice * 5;
  const priceMap = {
    vip:     Math.round(maxPrice),
    gold:    Math.round(maxPrice * 0.6),
    silver:  Math.round(maxPrice * 0.35),
    general: Math.round(minPrice),
  };

  const tierPrice = selectedTier ? priceMap[selectedTier.id] : 0;
  const subtotal = tierPrice * qty;
  const convenience = CONVENIENCE_FEE_PER_TICKET * qty;
  const total = subtotal + convenience;

  const title = item.title;
  const date = item.date;
  const time = item.time;
  const venue = item.venue;
  const city = item.city;
  const teams = item.teams;

  function handleBook() {
    if (!selectedTier) return;
    // Go to payment page with booking summary
    navigate('/payment', {
      state: {
        from:        'event',
        title,
        venue:       `${venue}${city ? ', ' + city : ''}`,
        time,
        date,
        type,
        qty,
        tier:         selectedTier.label,
        seats:        Array.from({ length: qty }, (_, i) => `${selectedTier.id.toUpperCase()}-${101 + i}`),
        seatTier:     selectedTier.label,
        ticketsTotal: subtotal,
        convenience,
        grandTotal:   total,
        totalAmount:  total,
      },
    });
  }

  return (
    <div className="bms-home">
      <BmsHeader />

      {/* Event banner */}
      <div className="eb-hero">
        <img className="eb-hero-img" src={image || `https://picsum.photos/seed/eb${item.id}/1280/300`} alt={title}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/eb${item.id}/1280/300`; }} />
        <div className="eb-hero-overlay">
          <div className="bms-container eb-hero-content">
            <span className="eb-type-badge">{type === 'sport' ? '🏆 Sports' : type === 'play' ? '🎭 Theatre' : '🎤 Event'}</span>
            <h1 className="eb-title">{title}</h1>
            {teams && (
              <div className="eb-teams">
                <span className="eb-team">{teams[0]}</span>
                <span className="eb-vs">VS</span>
                <span className="eb-team">{teams[1]}</span>
              </div>
            )}
            <div className="eb-meta">
              {date && <span>📅 {date}</span>}
              {time && <span>⏰ {time}</span>}
              {venue && <span>📍 {venue}{city ? `, ${city}` : ''}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bms-container eb-body">
        <div className="eb-layout">

          {/* Left — seat tier selection */}
          <div className="eb-left">
            <h2 className="eb-section-title">Select Seating Category</h2>
            <div className="eb-tiers">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`eb-tier-card${selectedTier?.id === tier.id ? ' selected' : ''}`}
                  style={{ '--tier-color': tier.color }}
                  onClick={() => setSelectedTier(tier)}
                >
                  <div className="eb-tier-left">
                    <span className="eb-tier-icon">{tier.icon}</span>
                    <div>
                      <div className="eb-tier-name">{tier.label}</div>
                      <div className="eb-tier-desc">{tier.desc}</div>
                    </div>
                  </div>
                  <div className="eb-tier-price">₹{priceMap[tier.id].toLocaleString('en-IN')}</div>
                  {selectedTier?.id === tier.id && <div className="eb-tier-check">✓</div>}
                </div>
              ))}
            </div>

            {/* Stadium diagram */}
            <div className="eb-stadium">
              <div className="eb-stadium-label">Stadium / Venue Layout</div>
              <div className="eb-pitch">
                <div className="eb-pitch-inner">
                  {type === 'sport' ? '🏏' : type === 'play' ? '🎭' : '🎤'}
                  <span>{type === 'sport' ? 'PITCH' : type === 'play' ? 'STAGE' : 'STAGE'}</span>
                </div>
              </div>
              <div className="eb-stands">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`eb-stand${selectedTier?.id === tier.id ? ' active' : ''}`}
                    style={{ background: selectedTier?.id === tier.id ? tier.color : undefined }}
                    onClick={() => setSelectedTier(tier)}
                  >
                    {tier.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — booking summary */}
          <div className="eb-right">
            <div className="eb-summary-card">
              <h3 className="eb-summary-title">Booking Summary</h3>

              <div className="eb-event-mini">
                <img src={image || `https://picsum.photos/seed/eb${item.id}/80/80`} alt={title} className="eb-mini-img"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/eb${item.id}/80/80`; }} />
                <div>
                  <div className="eb-mini-title">{title}</div>
                  <div className="eb-mini-meta">{date} • {venue}</div>
                </div>
              </div>

              {selectedTier && (
                <div className="eb-selected-tier" style={{ borderColor: selectedTier.color }}>
                  <span>{selectedTier.icon} {selectedTier.label}</span>
                  <span>₹{priceMap[selectedTier.id].toLocaleString('en-IN')} / ticket</span>
                </div>
              )}

              <div className="eb-qty-row">
                <span className="eb-qty-label">Tickets</span>
                <div className="eb-qty-ctrl">
                  <button className="eb-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <span className="eb-qty-num">{qty}</span>
                  <button className="eb-qty-btn" onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
                </div>
              </div>

              <div className="eb-price-breakdown">
                <div className="eb-price-row">
                  <span>Ticket Price ({qty}×)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="eb-price-row">
                  <span>Convenience Fee</span>
                  <span>₹{convenience.toLocaleString('en-IN')}</span>
                </div>
                <div className="eb-price-row total">
                  <span>Total Payable</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                className="eb-book-btn"
                disabled={!selectedTier || booking}
                onClick={handleBook}
              >
                {booking ? 'Booking...' : selectedTier ? `Pay ₹${total.toLocaleString('en-IN')}` : 'Select a Category'}
              </button>

              <div className="eb-secure-note">
                🔒 Secure payment • Instant e-ticket • No hidden charges
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
