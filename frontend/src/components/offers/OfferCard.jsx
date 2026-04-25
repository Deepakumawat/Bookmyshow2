import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export function OfferCard({ offer, onApply, onCopyCode }) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const isDark = theme === 'dark';

  const handleCopyCode = () => {
    onCopyCode?.(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const daysLeft = Math.ceil((new Date(offer.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  const usagePercentage = (offer.usageCount / offer.usageLimit) * 100;

  const discountDisplay =
    offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${offer.color}20 0%, ${offer.color}10 100%)`,
        border: `2px solid ${offer.color}40`,
        borderRadius: 12,
        padding: 16,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 16px ${offer.color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Emoji Badge */}
      <div
        style={{
          fontSize: 40,
          marginBottom: 12,
          height: 48,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {offer.emoji}
      </div>

      {/* Discount Badge */}
      <div
        style={{
          background: offer.color,
          color: 'white',
          padding: '8px 12px',
          borderRadius: 8,
          display: 'inline-block',
          marginBottom: 12,
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {discountDisplay} OFF
      </div>

      {/* Title and Description */}
      <h3 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
        {offer.title}
      </h3>
      <p style={{ margin: '0 0 12px 0', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {offer.description}
      </p>

      {/* Conditions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
        {offer.minCartValue > 0 && (
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600 }}>Min:</span> ₹{offer.minCartValue}
          </div>
        )}

        {offer.maxDiscount && (
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600 }}>Max:</span> ₹{offer.maxDiscount}
          </div>
        )}

        {offer.minTier !== 'BRONZE' && (
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600 }}>Tier:</span> {offer.minTier}+
          </div>
        )}

        {daysLeft > 0 && (
          <div style={{ fontSize: 11, color: daysLeft <= 7 ? '#FF4757' : 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600 }}>Expires:</span> {daysLeft}d
          </div>
        )}
      </div>

      {/* Applicable Categories */}
      {offer.applicableCategories && offer.applicableCategories.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ margin: '0 0 4px 0', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Applicable For
          </p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {offer.applicableCategories.slice(0, 3).map((category) => (
              <span
                key={category}
                style={{
                  padding: '2px 6px',
                  background: `${offer.color}30`,
                  color: offer.color,
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </span>
            ))}
            {offer.applicableCategories.length > 3 && (
              <span
                style={{
                  padding: '2px 6px',
                  background: `${offer.color}30`,
                  color: offer.color,
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                +{offer.applicableCategories.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Usage Progress Bar */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            marginBottom: 4,
            color: 'var(--text-secondary)',
          }}
        >
          <span>Limited Availability</span>
          <span>{offer.usageLimit - offer.usageCount} left</span>
        </div>
        <div
          style={{
            width: '100%',
            height: 6,
            background: 'var(--bg-secondary)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${100 - usagePercentage}%`,
              height: '100%',
              background: offer.color,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleCopyCode}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: offer.color + '20',
            border: `1px solid ${offer.color}`,
            borderRadius: 6,
            color: offer.color,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = offer.color;
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = offer.color + '20';
            e.target.style.color = offer.color;
          }}
        >
          {copied ? '✓ Copied' : '📋 Copy Code'}
        </button>

        <button
          onClick={() => onApply?.(offer.code)}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: offer.color,
            border: 'none',
            borderRadius: 6,
            color: 'white',
            fontSize: 13,
            fontWeight: 700,
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
          Apply Now
        </button>
      </div>
    </div>
  );
}
