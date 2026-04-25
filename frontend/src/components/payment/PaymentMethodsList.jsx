import React from 'react';
import { usePayment } from '../../context/PaymentContext';
import { useTheme } from '../../context/ThemeContext';
import { paymentMethodTemplates } from '../../data/paymentMethods';

export function PaymentMethodsList({ onSelectMethod, onAddNew }) {
  const { paymentMethods, selectedPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = usePayment();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  if (paymentMethods.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'var(--bg-secondary)',
          borderRadius: 12,
          border: '2px dashed var(--border)',
        }}
      >
        <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px 0' }}>No payment methods added</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
          Add a payment method to make bookings faster
        </p>
        <button
          onClick={onAddNew}
          style={{
            padding: '10px 24px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          + Add Payment Method
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {paymentMethods.map((method) => {
        const template = paymentMethodTemplates[method.type];
        const isSelected = selectedPaymentMethod?.id === method.id;

        return (
          <div
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            style={{
              padding: 16,
              background: isSelected ? 'var(--primary)' : 'var(--bg-secondary)',
              border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.background = isDark ? '#1a1a2e' : '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--bg-secondary)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
              <div
                style={{
                  fontSize: 32,
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSelected ? 'rgba(255,255,255,0.2)' : template.color + '20',
                  borderRadius: 8,
                }}
              >
                {template.icon}
              </div>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    color: isSelected ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {template.label}
                </p>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: 14,
                    color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                  }}
                >
                  {template.displayFormat(method)}
                </p>
                {method.isDefault && (
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 8,
                      padding: '2px 8px',
                      background: isSelected ? 'rgba(255,255,255,0.3)' : 'var(--primary)',
                      color: isSelected ? 'white' : 'white',
                      fontSize: 11,
                      fontWeight: 600,
                      borderRadius: 4,
                    }}
                  >
                    Default
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {!method.isDefault && (
                <button
                  onClick={() => setDefaultPaymentMethod(method.id)}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: isSelected ? 'white' : 'var(--primary)',
                    border: `1px solid ${isSelected ? 'rgba(255,255,255,0.3)' : 'var(--primary)'}`,
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isSelected ? 'rgba(255,255,255,0.1)' : 'var(--primary)';
                    e.target.style.color = isSelected ? 'white' : 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = isSelected ? 'white' : 'var(--primary)';
                  }}
                >
                  Set Default
                </button>
              )}

              <button
                onClick={() => removePaymentMethod(method.id)}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
                  border: `1px solid ${isSelected ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`,
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#FF4757';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = '#FF4757';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)';
                  e.target.style.borderColor = isSelected ? 'rgba(255,255,255,0.3)' : 'var(--border)';
                }}
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
