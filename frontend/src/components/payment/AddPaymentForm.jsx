import React, { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { useTheme } from '../../context/ThemeContext';
import { cardTypes, banks, walletProviders } from '../../data/paymentMethods';

export function AddPaymentForm({ onClose, onSuccess }) {
  const { addPaymentMethod } = usePayment();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [methodType, setMethodType] = useState('card');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (methodType === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Valid 16-digit card number required';
      }
      if (!formData.cardholderName) {
        newErrors.cardholderName = 'Cardholder name required';
      }
      if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Format: MM/YY';
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'Valid CVV required';
      }
      if (!formData.cardType) {
        newErrors.cardType = 'Card type required';
      }
    } else if (methodType === 'upi') {
      if (!formData.upiId || !/^[\w\.\-]+@[\w]+$/.test(formData.upiId)) {
        newErrors.upiId = 'Valid UPI ID required (e.g., name@bank)';
      }
    } else if (methodType === 'netbanking') {
      if (!formData.bankName) {
        newErrors.bankName = 'Bank name required';
      }
    } else if (methodType === 'wallet') {
      if (!formData.walletProvider) {
        newErrors.walletProvider = 'Wallet provider required';
      }
      if (!formData.walletId) {
        newErrors.walletId = 'Wallet ID/Phone required';
      }
      if (!formData.walletBalance || isNaN(formData.walletBalance)) {
        newErrors.walletBalance = 'Valid balance required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const method = {
        type: methodType,
        ...formData,
      };

      addPaymentMethod(method);
      onSuccess?.();
      onClose?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    const commonStyles = {
      width: '100%',
      padding: '10px 12px',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      fontSize: 14,
      color: 'var(--text-primary)',
      fontFamily: 'inherit',
      transition: 'all 0.2s ease',
    };

    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {methodType === 'card' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Card Type *
              </label>
              <select
                value={formData.cardType || ''}
                onChange={(e) => handleInputChange('cardType', e.target.value)}
                style={{
                  ...commonStyles,
                  cursor: 'pointer',
                }}
              >
                <option value="">Select card type</option>
                {cardTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.cardType && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.cardType}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Cardholder Name *
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.cardholderName || ''}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                style={commonStyles}
              />
              {errors.cardholderName && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.cardholderName}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Card Number *
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber || ''}
                onChange={(e) => {
                  let value = e.target.value.replace(/\s/g, '');
                  if (value.length <= 16) {
                    value = value.replace(/(\d{4})/g, '$1 ').trim();
                    handleInputChange('cardNumber', value);
                  }
                }}
                maxLength="19"
                style={commonStyles}
              />
              {errors.cardNumber && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.cardNumber}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Expiry Date (MM/YY) *
                </label>
                <input
                  type="text"
                  placeholder="12/25"
                  value={formData.expiryDate || ''}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    if (value.length <= 5) {
                      handleInputChange('expiryDate', value);
                    }
                  }}
                  maxLength="5"
                  style={commonStyles}
                />
                {errors.expiryDate && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.expiryDate}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  CVV *
                </label>
                <input
                  type="password"
                  placeholder="123"
                  value={formData.cvv || ''}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 4) {
                      handleInputChange('cvv', e.target.value);
                    }
                  }}
                  maxLength="4"
                  style={commonStyles}
                />
                {errors.cvv && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.cvv}</p>}
              </div>
            </div>
          </>
        )}

        {methodType === 'upi' && (
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              UPI ID *
            </label>
            <input
              type="text"
              placeholder="yourname@bankname"
              value={formData.upiId || ''}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              style={commonStyles}
            />
            {errors.upiId && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.upiId}</p>}
          </div>
        )}

        {methodType === 'netbanking' && (
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Select Bank *
            </label>
            <select
              value={formData.bankName || ''}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              style={{
                ...commonStyles,
                cursor: 'pointer',
              }}
            >
              <option value="">Select your bank</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            {errors.bankName && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.bankName}</p>}
          </div>
        )}

        {methodType === 'wallet' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Wallet Provider *
              </label>
              <select
                value={formData.walletProvider || ''}
                onChange={(e) => handleInputChange('walletProvider', e.target.value)}
                style={{
                  ...commonStyles,
                  cursor: 'pointer',
                }}
              >
                <option value="">Select wallet provider</option>
                {walletProviders.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
              {errors.walletProvider && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.walletProvider}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Wallet ID / Phone Number *
              </label>
              <input
                type="text"
                placeholder="9876543210"
                value={formData.walletId || ''}
                onChange={(e) => handleInputChange('walletId', e.target.value)}
                style={commonStyles}
              />
              {errors.walletId && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.walletId}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Wallet Balance (₹) *
              </label>
              <input
                type="number"
                placeholder="10000"
                value={formData.walletBalance || ''}
                onChange={(e) => handleInputChange('walletBalance', e.target.value)}
                style={commonStyles}
              />
              {errors.walletBalance && <p style={{ margin: '4px 0 0 0', color: '#FF4757', fontSize: 12 }}>{errors.walletBalance}</p>}
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isSubmitting ? 'Adding...' : 'Add Payment Method'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 20px',
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
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 700 }}>Add Payment Method</h3>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'card', label: '💳 Card' },
            { id: 'upi', label: '📱 UPI' },
            { id: 'netbanking', label: '🏦 Net Banking' },
            { id: 'wallet', label: '👛 Wallet' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setMethodType(type.id)}
              style={{
                padding: '8px 16px',
                background: methodType === type.id ? 'var(--primary)' : 'var(--bg-secondary)',
                color: methodType === type.id ? 'white' : 'var(--text-primary)',
                border: methodType === type.id ? 'none' : '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (methodType !== type.id) {
                  e.target.style.borderColor = 'var(--primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (methodType !== type.id) {
                  e.target.style.borderColor = 'var(--border)';
                }
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {renderForm()}
    </div>
  );
}
