import React, { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { useTheme } from '../../context/ThemeContext';
import { paymentMethodTemplates } from '../../data/paymentMethods';

export function PaymentCheckout({ amount, orderId, onPaymentComplete, onCancel }) {
  const {
    paymentMethods,
    selectedPaymentMethod,
    selectPaymentMethod,
    processPayment,
    processingPayment,
    getDefaultPaymentMethod,
  } = usePayment();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentMethod, setCurrentMethod] = useState(selectedPaymentMethod || getDefaultPaymentMethod());
  const [showNewMethod, setShowNewMethod] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePaymentClick = async () => {
    if (!currentMethod) {
      alert('Please select a payment method');
      return;
    }

    setPaymentStatus('processing');
    const result = await processPayment(amount, orderId, currentMethod);

    setPaymentStatus(result.status);

    if (result.status === 'success') {
      setTimeout(() => {
        onPaymentComplete?.(result);
      }, 1500);
    }
  };

  if (paymentStatus === 'processing' || processingPayment) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          background: 'var(--bg-secondary)',
          borderRadius: 12,
        }}
      >
        <div
          style={{
            fontSize: 48,
            marginBottom: 16,
            animation: 'spin 1s linear infinite',
          }}
        >
          ⏳
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Processing Payment...</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Please wait while we process your payment</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          background: 'var(--bg-secondary)',
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'rgb(16, 185, 129)' }}>
          Payment Successful!
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Your booking has been confirmed. Redirecting...
        </p>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          background: 'var(--bg-secondary)',
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#FF4757' }}>
          Payment Failed
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
          Please try again with a different payment method
        </p>
        <button
          onClick={() => setPaymentStatus(null)}
          style={{
            padding: '10px 24px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      {/* Billing Summary */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700 }}>Order Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
          <span style={{ fontWeight: 600 }}>₹{(amount / 1.18).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Taxes (18% GST)</span>
          <span style={{ fontWeight: 600 }}>₹{(amount - amount / 1.18).toFixed(2)}</span>
        </div>
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
          <span>Total</span>
          <span style={{ color: 'var(--primary)' }}>₹{amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700 }}>Select Payment Method</h3>

        {paymentMethods.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {paymentMethods.map((method) => {
              const template = paymentMethodTemplates[method.type];
              const isSelected = currentMethod?.id === method.id;

              return (
                <label
                  key={method.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    background: isSelected ? 'var(--primary)' : 'var(--bg-primary)',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={isSelected}
                    onChange={() => setCurrentMethod(method)}
                    style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? 'white' : 'var(--text-primary)' }}>
                      {template.label}
                    </div>
                    <div style={{ fontSize: 12, color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>
                      {template.displayFormat(method)}
                    </div>
                  </div>
                  <div style={{ fontSize: 20 }}>{template.icon}</div>
                </label>
              );
            })}
          </div>
        ) : null}

        <button
          onClick={() => setShowNewMethod(!showNewMethod)}
          style={{
            width: '100%',
            padding: 12,
            background: 'transparent',
            color: 'var(--primary)',
            border: '2px dashed var(--primary)',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
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
          + Add New Payment Method
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handlePaymentClick}
          disabled={!currentMethod}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: currentMethod ? 'var(--primary)' : 'var(--text-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 700,
            cursor: currentMethod ? 'pointer' : 'not-allowed',
            opacity: currentMethod ? 1 : 0.5,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (currentMethod) {
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          Pay ₹{amount.toFixed(2)}
        </button>
        <button
          onClick={onCancel}
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
          Cancel
        </button>
      </div>
    </div>
  );
}
