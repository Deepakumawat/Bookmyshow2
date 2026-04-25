import React from 'react';
import { useSeatSelection } from '../../context/SeatSelectionContext';
import { useTheme } from '../../context/ThemeContext';

function BookingSidebar() {
  const { selectedSeats, totalPrice, getSelectedSeatsList, clearSelection } =
    useSeatSelection();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        position: 'sticky',
        top: 20,
        background: isDark ? '#1a2332' : '#f8fafc',
        border: `1px solid var(--border)`,
        borderRadius: 12,
        padding: 20,
        height: 'fit-content',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 16 }}>Booking Summary</h3>

      {selectedSeats.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
          No seats selected
        </p>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                margin: '0 0 8px 0',
                fontSize: 12,
                color: 'var(--text-secondary)',
                fontWeight: 600,
              }}
            >
              Selected Seats ({selectedSeats.length})
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              {getSelectedSeatsList().map((seatId) => (
                <span
                  key={seatId}
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {seatId}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid var(--border)`,
              paddingTop: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                fontSize: 13,
              }}
            >
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                fontSize: 13,
              }}
            >
              <span>Taxes & Fees</span>
              <span>₹{Math.round(totalPrice * 0.18)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--primary)',
              }}
            >
              <span>Total</span>
              <span>₹{Math.round(totalPrice * 1.18)}</span>
            </div>
          </div>

          <button
            onClick={clearSelection}
            style={{
              width: '100%',
              padding: 8,
              background: 'transparent',
              border: `1px solid var(--border)`,
              borderRadius: 6,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            Clear Selection
          </button>
        </>
      )}

      <button
        disabled={selectedSeats.length === 0}
        style={{
          width: '100%',
          padding: 12,
          background: selectedSeats.length > 0 ? 'var(--primary)' : 'var(--border)',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          fontSize: 13,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          if (selectedSeats.length > 0) {
            e.target.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
        }}
      >
        {selectedSeats.length > 0 ? 'Proceed to Payment' : 'Select Seats'}
      </button>
    </div>
  );
}

export default BookingSidebar;
