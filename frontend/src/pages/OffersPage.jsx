import React, { useState, useMemo } from 'react';
import { useOffer } from '../context/OfferContext';
import { useTheme } from '../context/ThemeContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { useCategory } from '../context/CategoryContext';
import { getActiveOffers, getRecommendedOffers } from '../data/offers';
import { OfferCard } from '../components/offers/OfferCard';
import './OffersPage.css';

function OffersPage() {
  const { applyOffer } = useOffer();
  const { theme } = useTheme();
  const { loyaltyState } = useLoyalty();
  const { selectedCategory } = useCategory();
  const [filterType, setFilterType] = useState('recommended');
  const [copiedCode, setCopiedCode] = useState(null);

  const isDark = theme === 'dark';

  const activeOffers = useMemo(() => {
    if (filterType === 'recommended') {
      return getRecommendedOffers(1000, loyaltyState?.currentTier?.tier || 'BRONZE', selectedCategory?.id);
    } else if (filterType === 'all') {
      return getActiveOffers({
        category: selectedCategory?.id,
        minTier: loyaltyState?.currentTier?.tier || 'BRONZE',
      });
    } else if (filterType === 'tier-exclusive') {
      return getActiveOffers({
        category: selectedCategory?.id,
        minTier: loyaltyState?.currentTier?.tier || 'BRONZE',
      }).filter((o) => o.minTier !== 'BRONZE');
    } else if (filterType === 'expiring-soon') {
      return getActiveOffers().filter((o) => {
        const daysLeft = Math.ceil((new Date(o.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft > 0;
      });
    }
    return getActiveOffers();
  }, [filterType, selectedCategory, loyaltyState]);

  const handleApplyCode = (code) => {
    const result = applyOffer(code, 1000, loyaltyState?.currentTier?.tier || 'BRONZE', selectedCategory?.id);
    if (result.success) {
      // Show success message or navigate
      alert(`Offer ${code} has been applied!`);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`offers-page ${isDark ? '' : 'light'}`}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
          padding: '20px 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, color: 'white', fontSize: 28, fontWeight: 700 }}>
          🎉 Offers & Promotions
        </h1>
        <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
          Discover amazing deals and save on your bookings
        </p>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {/* Current Tier Badge */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 32,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Your Loyalty Tier
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 700 }}>
              {loyaltyState?.currentTier?.tier || 'Bronze'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              You Can Access
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
              {activeOffers.length} Offers
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 32,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 16,
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'recommended', label: '⭐ Recommended' },
            { id: 'all', label: '📋 All Offers' },
            { id: 'tier-exclusive', label: '👑 Exclusive' },
            { id: 'expiring-soon', label: '⏰ Ending Soon' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              style={{
                padding: '10px 16px',
                background: filterType === filter.id ? 'var(--primary)' : 'transparent',
                color: filterType === filter.id ? 'white' : 'var(--text-primary)',
                border: filterType === filter.id ? 'none' : '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (filterType !== filter.id) {
                  e.target.style.borderColor = 'var(--primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (filterType !== filter.id) {
                  e.target.style.borderColor = 'var(--border)';
                }
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        {activeOffers.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {activeOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onApply={handleApplyCode}
                onCopyCode={handleCopyCode}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: 60,
              background: 'var(--bg-secondary)',
              borderRadius: 12,
            }}
          >
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No Offers Available</p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Try selecting a different filter or upgrading your loyalty tier to unlock more offers
            </p>

            <button
              onClick={() => setFilterType('all')}
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
              View All Offers
            </button>
          </div>
        )}

        {/* How It Works Section */}
        <div style={{ marginTop: 60 }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: 20, fontWeight: 700 }}>How to Use Offers</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 20,
            }}
          >
            {[
              {
                number: 1,
                title: 'Find an Offer',
                description: 'Browse and select the offer that best suits your booking',
                emoji: '🔍',
              },
              {
                number: 2,
                title: 'Copy Code',
                description: 'Click "Copy Code" to save the promo code to clipboard',
                emoji: '📋',
              },
              {
                number: 3,
                title: 'Apply at Checkout',
                description: 'Paste the code during payment to apply the discount',
                emoji: '💳',
              },
              {
                number: 4,
                title: 'Save & Enjoy',
                description: 'Complete booking and enjoy your savings!',
                emoji: '🎉',
              },
            ].map((step) => (
              <div
                key={step.number}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    marginBottom: 12,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.emoji}
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    margin: '0 auto 12px',
                  }}
                >
                  {step.number}
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            background: 'var(--bg-secondary)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>💡 Terms & Conditions:</p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Offers cannot be stacked unless specified</li>
            <li>Each offer has minimum purchase requirements</li>
            <li>Some offers are tier or category-exclusive</li>
            <li>Offers are subject to availability and expiry date</li>
            <li>Refunds will be calculated after offer discount</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default OffersPage;
