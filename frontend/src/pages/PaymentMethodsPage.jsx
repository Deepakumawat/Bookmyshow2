import React, { useState } from 'react';
import { usePayment } from '../context/PaymentContext';
import { useTheme } from '../context/ThemeContext';
import { PaymentMethodsList } from '../components/payment/PaymentMethodsList';
import { AddPaymentForm } from '../components/payment/AddPaymentForm';
import './PaymentMethodsPage.css';

function PaymentMethodsPage() {
  const { paymentMethods, selectPaymentMethod } = usePayment();
  const { theme } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);

  const isDark = theme === 'dark';

  return (
    <div className={`payment-methods-page ${isDark ? '' : 'light'}`}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
          padding: '20px 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, color: 'white', fontSize: 28, fontWeight: 700 }}>Payment Methods</h1>
        <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
          Manage your saved payment methods
        </p>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        {!showAddForm ? (
          <>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>💳</div>
                <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Total Methods
                </p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>
                  {paymentMethods.length}
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
                <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Default
                </p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                  {paymentMethods.find((m) => m.isDefault)?.type.toUpperCase() || 'None'}
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
                <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Security
                </p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgb(16, 185, 129)' }}>Protected</p>
              </div>
            </div>

            {/* Payment Methods List */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Your Payment Methods</h2>
                {paymentMethods.length > 0 && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    style={{
                      padding: '10px 20px',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    + Add Method
                  </button>
                )}
              </div>

              <PaymentMethodsList
                onSelectMethod={selectPaymentMethod}
                onAddNew={() => setShowAddForm(true)}
              />
            </div>

            {/* Security Info */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 700, color: 'rgb(16, 185, 129)' }}>
                🔒 Your payment information is secure
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <li>All payment data is encrypted with SSL/TLS</li>
                <li>We never store full card numbers or CVV codes</li>
                <li>Your payment methods are protected with PCI DSS compliance</li>
                <li>You can remove saved methods at any time</li>
              </ul>
            </div>
          </>
        ) : (
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                marginBottom: 20,
                padding: '8px 16px',
                background: 'transparent',
                color: 'var(--primary)',
                border: '1px solid var(--primary)',
                borderRadius: 6,
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
              ← Back
            </button>

            <AddPaymentForm
              onClose={() => setShowAddForm(false)}
              onSuccess={() => setShowAddForm(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default PaymentMethodsPage;
