import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './UserJourneyPage.css';

export function UserJourneyPage() {
  const { isDark } = useContext(ThemeContext);
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      phase: 'Phase 1',
      title: '🔍 Discovery & Exploration',
      description: 'Find events that match your interests',
      features: [
        {
          icon: '🏠',
          name: 'Homepage',
          description: 'Browse hero banners and now showing carousel',
          connected: 'Displays personalized recommendations from Phase 2',
        },
        {
          icon: '🎬',
          name: 'Category Selection',
          description: 'Filter by Movies, Events, Plays, Sports, Streaming',
          connected: 'Updates recommendation algorithm',
        },
        {
          icon: '🔍',
          name: 'Smart Search',
          description: 'Natural language search with NLP',
          connected: 'Finds events matching your preferences',
        },
        {
          icon: '⭐',
          name: 'Filters & Tags',
          description: 'Genre, language, rating filters',
          connected: 'Refines recommendations and search results',
        },
      ],
    },
    {
      phase: 'Phase 2',
      title: '👥 User Profile & Personalization',
      description: 'Create your profile and get personalized recommendations',
      features: [
        {
          icon: '👤',
          name: 'User Profile',
          description: 'Manage preferences, genres, theaters',
          connected: 'Feeds into recommendation engine (Phase 2)',
        },
        {
          icon: '💝',
          name: 'Wishlist',
          description: 'Save events for later',
          connected: 'Can book directly from wishlist (Phase 3)',
        },
        {
          icon: '⭐',
          name: 'Reviews & Ratings',
          description: 'Submit and read reviews',
          connected: 'Appears on event details page',
        },
        {
          icon: '🤖',
          name: 'AI Recommendations',
          description: 'Personalized recommendations based on profile',
          connected: 'Shown on homepage and event details',
        },
      ],
    },
    {
      phase: 'Phase 3',
      title: '🎫 Booking & Transaction',
      description: 'Book events and earn loyalty rewards',
      features: [
        {
          icon: '📺',
          name: 'Event Details',
          description: 'Full event info, reviews, theater options',
          connected: 'Connected from recommendations (Phase 2)',
        },
        {
          icon: '🪑',
          name: 'Seating Selection',
          description: 'Choose seats interactively',
          connected: 'Updates price calculation in real-time',
        },
        {
          icon: '💳',
          name: 'Payment Methods',
          description: '6 payment options available',
          connected: 'Manages transactions and discounts',
        },
        {
          icon: '⭐',
          name: 'Loyalty Points',
          description: 'Earn points on every booking',
          connected: 'Updates loyalty tier and benefits',
        },
        {
          icon: '🔔',
          name: 'Notifications',
          description: 'Booking confirmations and alerts',
          connected: 'Notifies about bookings and rewards',
        },
      ],
    },
  ];

  const userFlows = [
    {
      flow: 'Discovery to Booking',
      steps: [
        '1. Browse Homepage (Phase 1)',
        '2. See AI Recommendations (Phase 2)',
        '3. Click Event Details (Phase 3)',
        '4. Read Reviews & Theater Info (Phase 2 & 3)',
        '5. Book Now → Seating Selection (Phase 3)',
        '6. Complete Payment (Phase 3)',
        '7. Confirm & Get Loyalty Points (Phase 3)',
        '8. Receive Notification (Phase 3)',
      ],
    },
    {
      flow: 'Wishlist to Booking',
      steps: [
        '1. Add to Wishlist (Phase 2)',
        '2. Go to Wishlist Page (Phase 2)',
        '3. Click Book Now (Phase 2 & 3)',
        '4. Seating Selection (Phase 3)',
        '5. Payment (Phase 3)',
        '6. Loyalty Points (Phase 3)',
      ],
    },
    {
      flow: 'Profile Optimization',
      steps: [
        '1. Visit Profile (Phase 2)',
        '2. Add Preferences (Phase 2)',
        '3. Homepage Updates (Phase 1)',
        '4. Better Recommendations (Phase 2)',
        '5. More Relevant Bookings (Phase 3)',
      ],
    },
    {
      flow: 'Loyalty Progression',
      steps: [
        '1. Make Booking (Phase 3)',
        '2. Earn Points (Phase 3)',
        '3. Check Loyalty Page (Phase 3)',
        '4. Redeem Points (Phase 3)',
        '5. Get Discount on Next Booking (Phase 3)',
      ],
    },
  ];

  const integrationPoints = [
    {
      from: 'Phase 1 → Phase 2',
      connection: 'Homepage recommendations powered by user profile',
      feature: 'AI Recommendation Engine',
    },
    {
      from: 'Phase 2 → Phase 1',
      connection: 'User preferences improve search filters',
      feature: 'Personalized Filters',
    },
    {
      from: 'Phase 2 → Phase 3',
      connection: 'Wishlists can be directly booked',
      feature: 'Direct Booking from Wishlist',
    },
    {
      from: 'Phase 3 → Phase 2',
      connection: 'Reviews and ratings shown on event details',
      feature: 'Review Integration',
    },
    {
      from: 'Phase 3 → Phase 3',
      connection: 'Bookings earn loyalty points',
      feature: 'Points System',
    },
    {
      from: 'Phase 3 (All)',
      connection: 'Notifications for bookings and loyalty',
      feature: 'Notification Hub',
    },
  ];

  return (
    <div className={`user-journey-page ${isDark ? '' : 'light'}`}>
      <div className="journey-container">
        {/* Header */}
        <div className="journey-header">
          <h1>🗺️ Complete User Journey Map</h1>
          <p>Explore how all phases connect to create a seamless experience</p>
        </div>

        {/* Phase Overview */}
        <section className="phases-section">
          <h2>📱 Three Integrated Phases</h2>
          <div className="phases-grid">
            {phases.map((phase, idx) => (
              <div key={idx} className="phase-card">
                <div
                  className="phase-header"
                  onClick={() =>
                    setExpandedPhase(expandedPhase === idx ? null : idx)
                  }
                >
                  <h3>{phase.phase}: {phase.title}</h3>
                  <span className="expand-icon">
                    {expandedPhase === idx ? '−' : '+'}
                  </span>
                </div>

                <p className="phase-description">{phase.description}</p>

                {expandedPhase === idx && (
                  <div className="phase-features">
                    {phase.features.map((feature, fidx) => (
                      <div key={fidx} className="feature-item">
                        <span className="feature-icon">{feature.icon}</span>
                        <div className="feature-info">
                          <h4>{feature.name}</h4>
                          <p className="feature-desc">{feature.description}</p>
                          <p className="feature-connection">
                            🔗 {feature.connected}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* User Flows */}
        <section className="flows-section">
          <h2>🧭 Common User Flows</h2>
          <div className="flows-grid">
            {userFlows.map((flow, idx) => (
              <div key={idx} className="flow-card">
                <h3>{flow.flow}</h3>
                <div className="flow-steps">
                  {flow.steps.map((step, sidx) => (
                    <div key={sidx} className="flow-step">
                      <span className="step-number">{sidx + 1}</span>
                      <span className="step-text">{step}</span>
                      {sidx < flow.steps.length - 1 && (
                        <span className="step-arrow">↓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Integration Points */}
        <section className="integration-section">
          <h2>🔗 Phase Integration Points</h2>
          <div className="integration-list">
            {integrationPoints.map((point, idx) => (
              <div key={idx} className="integration-item">
                <div className="integration-header">
                  <span className="from-badge">{point.from}</span>
                  <span className="feature-badge">{point.feature}</span>
                </div>
                <p className="connection-text">{point.connection}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Matrix */}
        <section className="matrix-section">
          <h2>✅ Feature Completion Matrix</h2>
          <div className="feature-matrix">
            <div className="matrix-header">
              <div className="matrix-cell header">Feature</div>
              <div className="matrix-cell header">Phase 1</div>
              <div className="matrix-cell header">Phase 2</div>
              <div className="matrix-cell header">Phase 3</div>
              <div className="matrix-cell header">Connected</div>
            </div>

            {[
              {
                feature: 'Discovery',
                p1: '✅',
                p2: '',
                p3: '',
                connected: 'P1→P2',
              },
              {
                feature: 'Recommendations',
                p1: '✅',
                p2: '✅',
                p3: '',
                connected: 'P2→P1',
              },
              {
                feature: 'User Profile',
                p1: '',
                p2: '✅',
                p3: '',
                connected: 'P2→P1',
              },
              {
                feature: 'Wishlist',
                p1: '',
                p2: '✅',
                p3: '✅',
                connected: 'P2→P3',
              },
              {
                feature: 'Reviews',
                p1: '',
                p2: '✅',
                p3: '✅',
                connected: 'P2→P3',
              },
              {
                feature: 'Event Details',
                p1: '',
                p2: '',
                p3: '✅',
                connected: 'P2→P3',
              },
              {
                feature: 'Booking',
                p1: '',
                p2: '',
                p3: '✅',
                connected: 'P3→All',
              },
              {
                feature: 'Loyalty',
                p1: '',
                p2: '',
                p3: '✅',
                connected: 'P3→P2',
              },
              {
                feature: 'Notifications',
                p1: '',
                p2: '',
                p3: '✅',
                connected: 'P3→All',
              },
            ].map((row, idx) => (
              <div key={idx} className="matrix-row">
                <div className="matrix-cell">{row.feature}</div>
                <div className="matrix-cell">{row.p1}</div>
                <div className="matrix-cell">{row.p2}</div>
                <div className="matrix-cell">{row.p3}</div>
                <div className="matrix-cell connected">{row.connected}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Actions */}
        <section className="actions-section">
          <h2>🚀 Get Started</h2>
          <div className="actions-grid">
            <a href="/" className="action-card">
              <span className="action-icon">🏠</span>
              <h3>Explore Home</h3>
              <p>See personalized recommendations</p>
            </a>
            <a href="/profile" className="action-card">
              <span className="action-icon">👤</span>
              <h3>Complete Profile</h3>
              <p>Set your preferences</p>
            </a>
            <a href="/wishlist" className="action-card">
              <span className="action-icon">💝</span>
              <h3>Build Wishlist</h3>
              <p>Save events to book later</p>
            </a>
            <a href="/loyalty" className="action-card">
              <span className="action-icon">⭐</span>
              <h3>View Loyalty</h3>
              <p>Check points and rewards</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
