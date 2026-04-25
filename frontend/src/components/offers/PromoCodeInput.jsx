import React, { useState } from 'react';
import { useOffer } from '../../context/OfferContext';
import { useTheme } from '../../context/ThemeContext';
import { useLoyalty } from '../../context/LoyaltyContext';
import { useBooking } from '../../context/BookingContext';

export function PromoCodeInput() {
  const { applyOffer, removeOffer, appliedCode, discountAmount, offerError, recentCodes } = useOffer();
  const { loyaltyState } = useLoyalty();
  const { bookingData } = useBooking();
  const { theme } = useTheme();
  const [inputCode, setInputCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const isDark = theme === 'dark';

  const handleApplyCode = async () => {
    if (!inputCode.trim()) return;

    setIsApplying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = applyOffer(
        inputCode,
        bookingData?.totalPrice || 0,
        loyaltyState?.currentTier?.tier || 'BRONZE',
        bookingData?.eventCategory || 'MOVIES'
      );

      if (result.success) {
        setInputCode('');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleQuickApply = (code) => {
    setInputCode(code);
    setTimeout(() => {
      const result = applyOffer(
        code,
        bookingData?.totalPrice || 0,
        loyaltyState?.currentTier?.tier || 'BRONZE',
        bookingData?.eventCategory || 'MOVIES'
      );
      if (result.success) {
        setInputCode('');
      }
    }, 100);
  };

  return (
    <div style={{ maxWidth: 500 }}>
      {/* Applied Offer */}
      {appliedCode && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgb(16, 185, 129)' }}>
                  {appliedCode} Applied
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                  You saved ₹{discountAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={removeOffer}
              style={{
                padding: '4px 8px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: 'none',
                borderRadius: 4,
                color: 'rgb(16, 185, 129)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(16, 185, 129, 0.2)';
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Input Section */}
      {!appliedCode && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Have a Promo Code?
          </label>

          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Enter promo code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApplyCode();
                }
              }}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'var(--bg-primary)',
                border: offerError ? '1px solid #FF4757' : '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 14,
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                if (!offerError) {
                  e.target.style.borderColor = 'var(--primary)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = offerError ? '#FF4757' : 'var(--border)';
              }}
            />

            <button
              onClick={handleApplyCode}
              disabled={!inputCode.trim() || isApplying}
              style={{
                padding: '10px 20px',
                background: inputCode.trim() && !isApplying ? 'var(--primary)' : 'var(--text-secondary)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: inputCode.trim() && !isApplying ? 'pointer' : 'not-allowed',
                opacity: inputCode.trim() && !isApplying ? 1 : 0.5,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (inputCode.trim() && !isApplying) {
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              {isApplying ? '...' : 'Apply'}
            </button>
          </div>

          {offerError && (
            <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#FF4757', fontWeight: 500 }}>
              ❌ {offerError}
            </p>
          )}
        </div>
      )}

      {/* Recent Codes */}
      {recentCodes.length > 0 && !appliedCode && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Recently Used
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {recentCodes.map((code) => (
              <button
                key={code}
                onClick={() => handleQuickApply(code)}
                style={{
                  padding: '6px 12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.background = 'var(--primary)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.background = 'var(--bg-secondary)';
                  e.target.style.color = 'var(--primary)';
                }}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
