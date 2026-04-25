import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export function Receipt({ bookingData, paymentData, onDownload, onClose }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
          color: 'white',
          padding: 30,
          borderRadius: '12px 12px 0 0',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: 24, fontWeight: 700 }}>Payment Successful</h2>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>Your booking has been confirmed</p>
      </div>

      {/* Receipt Content */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '0 0 12px 12px' }}>
        {/* Booking Details */}
        <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Booking Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>Booking ID</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, fontFamily: 'monospace' }}>
                {bookingData?.bookingId || 'BK' + Date.now().toString().slice(-8)}
              </p>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>Date & Time</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                {new Date(bookingData?.eventDate).toLocaleDateString('en-IN')}
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                {bookingData?.selectedShowtime}
              </p>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>Event</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{bookingData?.eventTitle}</p>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>Theater</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{bookingData?.theaterName}</p>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>Number of Seats</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                {bookingData?.selectedSeats?.length || 0} seat{(bookingData?.selectedSeats?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>Seats</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                {bookingData?.selectedSeats?.join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Payment Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({bookingData?.selectedSeats?.length || 0} seats)</span>
              <span style={{ fontWeight: 600 }}>₹{(paymentData?.amount / 1.18).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>GST (18%)</span>
              <span style={{ fontWeight: 600 }}>₹{(paymentData?.amount - paymentData?.amount / 1.18).toFixed(2)}</span>
            </div>

            {paymentData?.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgb(16, 185, 129)' }}>
                <span>Discount Applied</span>
                <span style={{ fontWeight: 600 }}>-₹{paymentData.discount.toFixed(2)}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border)',
                paddingTop: 12,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              <span>Total Amount Paid</span>
              <span style={{ color: 'var(--primary)' }}>₹{paymentData?.amount.toFixed(2) || 0}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Payment Method
          </h3>

          <div style={{ background: 'var(--bg-primary)', padding: 12, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Method</span>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{paymentData?.method}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Transaction ID</span>
              <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 12 }}>
                {paymentData?.transactionId}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Date & Time</span>
              <span style={{ fontWeight: 600 }}>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div style={{ padding: 24, background: isDark ? '#1a1a2e' : '#f9f9f9', borderRadius: '0 0 12px 12px' }}>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: 'rgb(16, 185, 129)', fontWeight: 600 }}>
              📧 A confirmation email has been sent to your registered email ID.
            </p>
          </div>

          <p style={{ margin: '0 0 12px 0', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Please arrive 15 minutes before the show time. Carry your booking confirmation or show this receipt at the theater.
          </p>

          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
            For cancellations and refunds, please visit your Booking History page. Refund will be processed within 5-7 business days.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button
          onClick={onDownload}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          📥 Download Receipt
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '14px 20px',
            background: 'transparent',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--primary)';
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
