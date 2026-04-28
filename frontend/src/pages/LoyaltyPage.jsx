import React, { useState, useContext } from 'react';
import { useLoyalty } from '../context/LoyaltyContext';
import { ThemeContext } from '../context/ThemeContext';
import './LoyaltyPage.css';

export default function LoyaltyPage() {
  const { loyaltyState, redeemPoints, getPointsToNextTier } = useLoyalty();
  const { isDark } = useContext(ThemeContext);

  const [selectedRedemption, setSelectedRedemption] = useState(null);
  const [redeemAmount, setRedeemAmount] = useState(0);

  const tierObj = loyaltyState.currentTier;
  const tier = tierObj?.tier || 'Silver';
  const points = loyaltyState.totalPoints || 0;
  const pointsToNext = getPointsToNextTier() || 0;

  const tierMaxPoints = { Bronze: 1000, Silver: 5000, Gold: 10000, Platinum: 10000 };
  const tierMinPoints = { Bronze: 0, Silver: 1000, Gold: 5000, Platinum: 10000 };
  const range = (tierMaxPoints[tier] || 5000) - (tierMinPoints[tier] || 0);
  const tierProgress = tier === 'Platinum' ? 100 : Math.min(100, Math.round(((points - (tierMinPoints[tier] || 0)) / range) * 100));

  const redemptionOptions = [
    { id: 1, title: 'Movie Ticket Discount', points: 100, discount: '₹100' },
    { id: 2, title: 'Premium Ticket Discount', points: 150, discount: '₹150' },
    { id: 3, title: 'Free Large Popcorn', points: 80, discount: 'Free Item' },
    { id: 4, title: 'VIP Lounge Access', points: 200, discount: '1 Month' },
    { id: 5, title: 'Priority Booking', points: 120, discount: '3 Months' },
    { id: 6, title: 'Birthday Special Offer', points: 250, discount: '₹500' },
  ];

  const tierBenefits = {
    Silver: {
      icon: '🥈',
      color: '#c0c0c0',
      benefits: [
        'Earn 1 point per ₹100 spent',
        '5% discount on all bookings',
        'Birthday special offer',
        'Priority customer support',
      ],
    },
    Gold: {
      icon: '🥇',
      color: '#ffd700',
      benefits: [
        'Earn 1.5 points per ₹100 spent',
        '10% discount on all bookings',
        'Free popcorn on movie tickets',
        'Exclusive member-only offers',
        'Early access to offers',
        'Dedicated customer support',
      ],
    },
    Platinum: {
      icon: '💎',
      color: '#8000ff',
      benefits: [
        'Earn 2 points per ₹100 spent',
        '15% discount on all bookings',
        'Free premium snacks',
        'VIP lounge access',
        'Priority event bookings',
        '24/7 premium support',
        'Annual VIP gift',
      ],
    },
  };

  const handleRedeem = () => {
    if (selectedRedemption && redeemAmount > 0 && redeemAmount <= points) {
      redeemPoints(selectedRedemption.id, redeemAmount);
      alert(`Redeemed ${redeemAmount} points for ${selectedRedemption.title}`);
      setSelectedRedemption(null);
      setRedeemAmount(0);
    }
  };

  return (
    <div className={`loyalty-page ${isDark ? '' : 'light'}`}>
      {/* Tier Card */}
      <div className="tier-card">
        <div className="tier-display">
          <span className="tier-icon">
            {tierBenefits[tier]?.icon}
          </span>
          <div className="tier-info">
            <h1 className="tier-name">{tier} Member</h1>
            <p className="tier-level">
              Loyalty Level {['Silver', 'Gold', 'Platinum'].indexOf(tier) + 1}
            </p>
          </div>
        </div>

        <div className="points-summary">
          <div className="points-card">
            <span className="points-label">Total Points</span>
            <span className="points-value">{points}</span>
          </div>
          <div className="points-card">
            <span className="points-label">Points to Next Tier</span>
            <span className="points-value">{pointsToNext}</span>
          </div>
          <div className="points-card">
            <span className="points-label">Tier Progress</span>
            <span className="points-value">{tierProgress}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-label">Progress to {tier === 'Platinum' ? 'Platinum' : tier === 'Gold' ? 'Platinum' : 'Gold'}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${tierProgress}%` }} />
          </div>
          <div className="progress-text">{tierProgress}% complete</div>
        </div>
      </div>

      <div className="loyalty-content">
        {/* Benefits Section */}
        <section className="benefits-section">
          <h2>Your Current Benefits</h2>
          <div className="benefits-grid">
            {tierBenefits[tier]?.benefits.map((benefit, idx) => (
              <div key={idx} className="benefit-card">
                <span className="benefit-icon">✨</span>
                <p>{benefit}</p>
              </div>
            ))}
          </div>

          <div className="tier-comparison">
            <h3>All Membership Tiers</h3>
            <div className="tiers-row">
              {['Silver', 'Gold', 'Platinum'].map((tierName) => (
                <div
                  key={tierName}
                  className={`tier-option ${tier === tierName ? 'active' : ''}`}
                >
                  <span className="tier-icon-small">
                    {tierBenefits[tierName]?.icon}
                  </span>
                  <h4>{tierName}</h4>
                  <ul className="tier-features">
                    {tierBenefits[tierName]?.benefits.slice(0, 2).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                    <li>... and more</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Redemption Section */}
        <section className="redemption-section">
          <h2>Redeem Your Points</h2>
          <p className="redemption-subtitle">You have {points} points available to redeem</p>

          <div className="redemption-grid">
            {redemptionOptions.map((option) => (
              <div
                key={option.id}
                className={`redemption-card ${selectedRedemption?.id === option.id ? 'selected' : ''}`}
                onClick={() => setSelectedRedemption(option)}
              >
                <div className="redemption-header">
                  <h4>{option.title}</h4>
                  <span className="redemption-points">{option.points} pts</span>
                </div>
                <p className="redemption-value">{option.discount}</p>
                <button className="select-btn">
                  {selectedRedemption?.id === option.id ? '✓ Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>

          {selectedRedemption && (
            <div className="redemption-form">
              <h3>Redeem {selectedRedemption.title}</h3>
              <div className="form-group">
                <label>Points to Redeem</label>
                <div className="input-group">
                  <input
                    type="number"
                    min={selectedRedemption.points}
                    max={points}
                    step={selectedRedemption.points}
                    value={redeemAmount || selectedRedemption.points}
                    onChange={(e) => setRedeemAmount(parseInt(e.target.value) || selectedRedemption.points)}
                    className="form-input"
                  />
                  <span className="max-points">Max: {points}</span>
                </div>
              </div>

              <div className="redemption-summary">
                <p>You will get: {selectedRedemption.discount}</p>
                <p>Points remaining: {points - (redeemAmount || selectedRedemption.points)}</p>
              </div>

              <button className="btn-redeem" onClick={handleRedeem}>
                Redeem Now
              </button>
            </div>
          )}
        </section>

        {/* Points History */}
        <section className="points-history-section">
          <h2>Points History</h2>
          <div className="history-list">
            <div className="history-item">
              <div className="history-icon">+</div>
              <div className="history-details">
                <h4>Movie Booking: Inception</h4>
                <p>₹750 spent at PVR Cinemas</p>
              </div>
              <div className="history-points">+75 pts</div>
              <span className="history-date">2 days ago</span>
            </div>

            <div className="history-item">
              <div className="history-icon">-</div>
              <div className="history-details">
                <h4>Points Redeemed</h4>
                <p>₹100 discount on booking</p>
              </div>
              <div className="history-points">-100 pts</div>
              <span className="history-date">5 days ago</span>
            </div>

            <div className="history-item">
              <div className="history-icon">+</div>
              <div className="history-details">
                <h4>Event Booking: Concert</h4>
                <p>₹2000 spent on concert tickets</p>
              </div>
              <div className="history-points">+300 pts</div>
              <span className="history-date">1 week ago</span>
            </div>

            <div className="history-item">
              <div className="history-icon">+</div>
              <div className="history-details">
                <h4>Tier Upgrade Bonus</h4>
                <p>Promoted to Gold membership</p>
              </div>
              <div className="history-points">+50 pts</div>
              <span className="history-date">2 weeks ago</span>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h4>How do I earn points?</h4>
              <p>
                You earn 1 point for every ₹100 spent on bookings. Gold members earn 1.5x points,
                and Platinum members earn 2x points.
              </p>
            </div>
            <div className="faq-item">
              <h4>Do points expire?</h4>
              <p>
                Your points never expire as long as you have at least one booking in the past 12 months.
              </p>
            </div>
            <div className="faq-item">
              <h4>Can I transfer points?</h4>
              <p>
                Points are tied to your account and cannot be transferred, but you can redeem them
                for discounts and offers.
              </p>
            </div>
            <div className="faq-item">
              <h4>How do I maintain my tier status?</h4>
              <p>
                Your membership tier is based on your spending. Once you reach Gold or Platinum,
                the status is maintained for at least 1 year.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
