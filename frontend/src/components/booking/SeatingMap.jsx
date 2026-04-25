import React, { useEffect } from 'react';
import { useSeatSelection } from '../../context/SeatSelectionContext';
import { useTheme } from '../../context/ThemeContext';
import { createTheaterLayout, seatTiers } from '../../data/seatModels';

function SeatingMap() {
  const { theaterLayout, setTheaterLayout, selectedSeats, hoveredSeat, setHoveredSeat, selectSeat } =
    useSeatSelection();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (theaterLayout.length === 0) {
      setTheaterLayout(createTheaterLayout());
    }
  }, [theaterLayout, setTheaterLayout]);

  const getSeatColor = (seat) => {
    if (selectedSeats.find((s) => s.id === seat.id)) {
      return '#E41B32'; // Selected - using primary theme color
    }
    if (seat.status === 'booked') {
      return isDark ? '#64748b' : '#cbd5e1'; // Booked
    }
    if (hoveredSeat === seat.id) {
      return '#10b981'; // Hovered
    }
    return seatTiers[seat.tier.toUpperCase()].color; // Tier color
  };

  if (theaterLayout.length === 0) {
    return <div>Loading seating layout...</div>;
  }

  return (
    <div
      style={{
        background: isDark ? '#0f172a' : '#f8fafc',
        padding: 24,
        borderRadius: 12,
        border: `1px solid var(--border)`,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 24, textAlign: 'center' }}>Select Your Seats</h3>

      {/* Screen indicator */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 32,
          padding: '12px',
          background: 'rgba(6, 182, 212, 0.1)',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-secondary)',
        }}
      >
        🎬 SCREEN
      </div>

      {/* Seating grid */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {theaterLayout.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                width: 20,
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              {row[0].row}
            </span>

            <div style={{ display: 'flex', gap: 6 }}>
              {row.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => selectSeat(seat)}
                  onMouseEnter={() => setHoveredSeat(seat.id)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  disabled={seat.status === 'booked'}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: getSeatColor(seat),
                    border: selectedSeats.find((s) => s.id === seat.id)
                      ? '2px solid white'
                      : 'none',
                    cursor: seat.status === 'booked' ? 'not-allowed' : 'pointer',
                    opacity: seat.status === 'booked' ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                  title={`${seat.row}${seat.number} - ₹${seat.price} (${seat.status})`}
                >
                  {seat.tier === 'executive' ? '♻' : seat.tier === 'vip' ? '✦' : ''}
                </button>
              ))}
            </div>

            <span
              style={{
                width: 20,
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              {row[0].row}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginTop: 24,
          paddingTop: 16,
          borderTop: `1px solid var(--border)`,
        }}
      >
        {[
          { color: , label: 'Selected', status: 'selected' },
          { color: seatTiers.STANDARD.color, label: 'Standard', status: 'available' },
          { color: seatTiers.PREMIUM.color, label: 'Premium', status: 'available' },
          { color: seatTiers.VIP.color, label: 'VIP', status: 'available' },
          { color: seatTiers.EXECUTIVE.color, label: 'Executive', status: 'available' },
          { color: isDark ? '#64748b' : '#cbd5e1', label: 'Booked', status: 'booked' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: item.color,
                opacity: item.status === 'booked' ? 0.5 : 1,
              }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeatingMap;
