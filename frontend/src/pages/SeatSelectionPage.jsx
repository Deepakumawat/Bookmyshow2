import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BmsHeader from '../components/layout/BmsHeader';
import UrgencyWidget from '../components/ml/UrgencyWidget';
import PricePrediction from '../components/ml/PricePrediction';
import SmartBundle from '../components/ml/SmartBundle';
import '../styles/bms-theme.css';
import './SeatSelectionPage.css';

const SEAT_CATEGORIES = [
  { id: 'recliner', label: 'Recliner',  priceMultiplier: 1.6, color: '#9b59b6', rows: ['A', 'B'],              icon: '💺' },
  { id: 'gold',     label: 'Gold',      priceMultiplier: 1.2, color: '#f39c12', rows: ['C', 'D', 'E'],         icon: '⭐' },
  { id: 'silver',   label: 'Silver',    priceMultiplier: 1.0, color: '#2980b9', rows: ['F', 'G', 'H'],         icon: '🎟️' },
  { id: 'general',  label: 'General',   priceMultiplier: 0.7, color: '#27ae60', rows: ['I', 'J', 'K'],         icon: '🎫' },
];

const COLS = 12;
const CONVENIENCE_FEE = 30;

function generateReserved() {
  const reserved = new Set();
  const allRows = SEAT_CATEGORIES.flatMap(c => c.rows);
  for (let i = 0; i < 25; i++) {
    const r = allRows[Math.floor(Math.random() * allRows.length)];
    const c = Math.floor(Math.random() * COLS) + 1;
    reserved.add(`${r}${c}`);
  }
  return reserved;
}

export default function SeatSelectionPage() {
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();
  const showId     = searchParams.get('showId')      || 'show-1';
  const theatreName = searchParams.get('theatreName') || 'Cinema Hall';
  const movieTitle = searchParams.get('movieTitle')  || 'Movie';
  const showTime   = searchParams.get('time')        || '7:00 PM';
  const showFormat = searchParams.get('format')      || '2D';
  const basePrice  = parseInt(searchParams.get('price') || '250');

  const catPrice = (cat) => Math.round(basePrice * cat.priceMultiplier);

  const [reserved] = useState(generateReserved);
  const [selected, setSelected]   = useState(new Set());
  const [loading, setLoading]     = useState(false);

  const toggleSeat = (seatId) => {
    if (reserved.has(seatId)) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(seatId)) next.delete(seatId);
      else if (next.size < 10) next.add(seatId);
      return next;
    });
  };

  const getCatForRow = (row) =>
    SEAT_CATEGORIES.find(c => c.rows.includes(row)) || SEAT_CATEGORIES[3];

  const totalTickets = () => {
    let t = 0;
    for (const s of selected) {
      t += catPrice(getCatForRow(s[0]));
    }
    return t;
  };

  const convenience = CONVENIENCE_FEE * selected.size;
  const grandTotal  = totalTickets() + convenience;

  const handleProceed = () => {
    if (selected.size === 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/payment', {
        state: {
          from: 'seats',
          movieTitle,
          theatreName,
          showTime,
          showFormat,
          seats: Array.from(selected),
          ticketsTotal: totalTickets(),
          convenience,
          grandTotal,
          showId,
        }
      });
    }, 400);
  };

  // Seat breakdown for sticky bar
  const seatsByCategory = SEAT_CATEGORIES.map(cat => {
    const catSeats = Array.from(selected).filter(s => cat.rows.includes(s[0]));
    return { ...cat, count: catSeats.length, price: catPrice(cat) };
  }).filter(c => c.count > 0);

  return (
    <div className="bms-home">
      <BmsHeader />

      <div className="bss-info-bar">
        <div className="bms-container bss-info-inner">
          <button className="bst-back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <div className="bss-movie-title">{movieTitle}</div>
            <div className="bss-meta">
              {theatreName} &nbsp;•&nbsp; {showTime}
              {showFormat !== '2D' && <span className="bss-format-badge">{showFormat}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bms-container" style={{ paddingTop: 16 }}>
        <UrgencyWidget showId={1} />
        <PricePrediction showId={1} seatType="GOLD" />
      </div>

      <div className="bms-container bss-body">
        <div className="bss-screen-wrap">
          <div className="bss-screen">SCREEN THIS SIDE</div>
          <div className="bss-screen-shadow" />
        </div>

        <div className="bss-legend">
          <div className="bss-legend-item"><div className="bss-legend-box available" />Available</div>
          <div className="bss-legend-item"><div className="bss-legend-box selected" />Selected</div>
          <div className="bss-legend-item"><div className="bss-legend-box sold" />Sold Out</div>
        </div>

        {SEAT_CATEGORIES.map(cat => (
          <div key={cat.id} className="bss-category">
            <div className="bss-cat-header">
              <span className="bss-cat-icon">{cat.icon}</span>
              <span className="bss-cat-label">{cat.label}</span>
              <span className="bss-cat-price">₹{catPrice(cat)}</span>
            </div>
            {cat.rows.map(row => (
              <div key={row} className="bss-seat-row">
                <span className="bss-row-label">{row}</span>
                <div className="bss-seats">
                  {Array.from({ length: COLS }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isReserved = reserved.has(seatId);
                    const isSelected = selected.has(seatId);
                    return (
                      <button
                        key={seatId}
                        className={`bss-seat${isReserved ? ' sold' : isSelected ? ' selected' : ''}`}
                        style={isSelected ? { background: cat.color, borderColor: cat.color } : {}}
                        onClick={() => toggleSeat(seatId)}
                        title={isReserved ? 'Sold' : seatId}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <span className="bss-row-label">{row}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selected.size > 0 && (
        <div className="bms-container" style={{ marginBottom: 100 }}>
          <SmartBundle genre="Action" groupSize={selected.size} showTime="evening" seatType="GOLD" />
        </div>
      )}

      {selected.size > 0 && (
        <div className="bss-bottom-bar">
          <div className="bms-container bss-bottom-inner">
            <div className="bss-selected-info">
              <div className="bss-seat-list">{Array.from(selected).sort().join(', ')}</div>
              <div className="bss-cat-breakdown">
                {seatsByCategory.map(c => (
                  <span key={c.id} style={{ color: c.color }}>
                    {c.icon} {c.count}×{c.label} ₹{c.price}
                  </span>
                ))}
              </div>
            </div>
            <div className="bss-total-wrap">
              <div className="bss-price-row">
                <span>Tickets</span><span>₹{totalTickets()}</span>
              </div>
              <div className="bss-price-row">
                <span>Convenience</span><span>₹{convenience}</span>
              </div>
              <div className="bss-price-row total">
                <span>Total</span><span>₹{grandTotal}</span>
              </div>
            </div>
            <button
              className="bms-btn-red bss-proceed-btn"
              onClick={handleProceed}
              disabled={loading}
            >
              {loading ? 'Loading…' : `Proceed to Pay ₹${grandTotal} →`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
