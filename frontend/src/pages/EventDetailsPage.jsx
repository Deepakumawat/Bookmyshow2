import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { findEventById } from '../data/mockEvents';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { getReviewsByEventId, getAverageRating, getRatingDistribution } from '../data/reviewsData';
import { useReview } from '../context/ReviewContext';
import { useWishlist } from '../context/WishlistContext';
import { ThemeContext } from '../context/ThemeContext';
import IntegrationService from '../utils/integrationService';
import './EventDetailsPage.css';

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const event = findEventById(eventId);
  const [selectedTab, setSelectedTab] = useState('overview');
  const reviews = getReviewsByEventId(eventId || '1');
  const avgRating = getAverageRating(eventId || '1');
  const ratingDistribution = getRatingDistribution(eventId || '1');
  const { canSubmitReview, submitReview } = useReview();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDark } = useContext(ThemeContext);
  const [isInWishlistState, setIsInWishlistState] = useState(isInWishlist(eventId));

  if (!event) {
    return (
      <div className="event-details-page">
        <div className="event-not-found">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist.</p>
          <a href="/" className="btn-back">← Back to Home</a>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (isInWishlistState) {
      removeFromWishlist(eventId);
    } else {
      addToWishlist(event);
    }
    setIsInWishlistState(!isInWishlistState);
  };

  const handleReviewSubmit = (eid, reviewData) => {
    submitReview(eid, reviewData);
  };

  const handleBookNow = () => {
    // Use integration service to navigate with event context
    IntegrationService.navigateToBooking(eventId, event.title);
  };

  const renderRatingBars = () => {
    const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
    return (
      <div className="rating-bars">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="rating-bar">
            <span className="rating-label">{rating}★</span>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: total > 0 ? `${(ratingDistribution[rating] / total) * 100}%` : '0%',
                }}
              />
            </div>
            <span className="rating-count">{ratingDistribution[rating]}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`event-details-page ${isDark ? '' : 'light'}`}>
      {/* Header Section */}
      <div className="event-header">
        <div className="event-poster">
          <div className="poster-image">{event.image || '🎬'}</div>
        </div>

        <div className="event-info">
          <div className="event-title-section">
            <h1>{event.title}</h1>
            {event.year && <span className="event-year">{event.year}</span>}
          </div>

          <div className="event-meta">
            {event.genres && (
              <div className="meta-item">
                <span className="meta-label">Genre:</span>
                <div className="genre-tags">
                  {event.genres.map((g) => (
                    <span key={g} className="genre-tag">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.language && (
              <div className="meta-item">
                <span className="meta-label">Language:</span>
                <span className="meta-value">{event.language}</span>
              </div>
            )}

            {event.duration && (
              <div className="meta-item">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{event.duration}</span>
              </div>
            )}

            {event.director && (
              <div className="meta-item">
                <span className="meta-label">Director:</span>
                <span className="meta-value">{event.director}</span>
              </div>
            )}

            {event.certification && (
              <div className="meta-item">
                <span className="meta-label">Certification:</span>
                <span className="certification-badge">{event.certification}</span>
              </div>
            )}
          </div>

          <div className="event-rating">
            <div className="rating-display">
              <span className="stars">{'⭐'.repeat(Math.round(event.rating))}</span>
              <span className="rating-value">{event.rating.toFixed(1)}</span>
              <span className="review-count">({reviews.length} reviews)</span>
            </div>
          </div>

          <p className="event-description">{event.description}</p>

          <div className="event-actions">
            <button className="btn-book-event" onClick={handleBookNow}>
              📅 Book Now
            </button>
            <button
              className={`btn-wishlist ${isInWishlistState ? 'in-wishlist' : ''}`}
              onClick={handleWishlistToggle}
            >
              {isInWishlistState ? '💖 In Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="event-tabs">
        <button
          className={`tab-button ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${selectedTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setSelectedTab('reviews')}
        >
          Reviews & Ratings
        </button>
        {event.type === 'movie' && (
          <button
            className={`tab-button ${selectedTab === 'theaters' ? 'active' : ''}`}
            onClick={() => setSelectedTab('theaters')}
          >
            Theaters
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {selectedTab === 'overview' && (
          <section className="overview-section">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📖 Story</h3>
                <p>{event.description}</p>
              </div>

              {event.director && (
                <div className="overview-card">
                  <h3>🎬 Director</h3>
                  <p>{event.director}</p>
                </div>
              )}

              {event.artist && (
                <div className="overview-card">
                  <h3>🎤 Artist/Performer</h3>
                  <p>{event.artist}</p>
                </div>
              )}

              {event.author && (
                <div className="overview-card">
                  <h3>✍️ Author</h3>
                  <p>{event.author}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {selectedTab === 'reviews' && (
          <section className="reviews-section">
            <div className="reviews-container">
              {/* Rating Summary */}
              <div className="rating-summary">
                <div className="average-rating">
                  <span className="large-rating">{avgRating}</span>
                  <span className="stars-large">
                    {'⭐'.repeat(Math.round(avgRating))}
                  </span>
                  <span className="review-summary-text">
                    out of 5<br />
                    Based on {reviews.length} reviews
                  </span>
                </div>

                {renderRatingBars()}
              </div>

              {/* Review Form */}
              {canSubmitReview(eventId) && (
                <ReviewForm
                  eventId={eventId}
                  eventTitle={event.title}
                  onSubmit={handleReviewSubmit}
                  canSubmit={true}
                />
              )}

              {/* Reviews List */}
              <div className="reviews-list">
                <h3>User Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onHelpful={(id) => {
                        // Handle helpful vote
                      }}
                      onUnhelpful={(id) => {
                        // Handle unhelpful vote
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {selectedTab === 'theaters' && (
          <section className="theaters-section">
            <h3>Available Theaters</h3>
            <div className="theaters-list">
              <div className="theater-card">
                <h4>PVR Cinemas Downtown</h4>
                <p>📍 123 Main Street, Downtown</p>
                <p>⭐ 4.5 (284 reviews)</p>
                <p>✨ Premium recliners, Dolby Atmos, F&B Available</p>
                <button className="btn-select-theater">Select Theater →</button>
              </div>
              <div className="theater-card">
                <h4>INOX Leisure</h4>
                <p>📍 Shopping Mall, Sector 10</p>
                <p>⭐ 4.3 (156 reviews)</p>
                <p>✨ IMAX, Parking, Food Court</p>
                <button className="btn-select-theater">Select Theater →</button>
              </div>
              <div className="theater-card">
                <h4>Cinepolis Grand</h4>
                <p>📍 Entertainment Hub, North</p>
                <p>⭐ 4.6 (412 reviews)</p>
                <p>✨ 4K Projection, Wheelchair Access, WiFi</p>
                <button className="btn-select-theater">Select Theater →</button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Similar Events Section */}
      <section className="similar-events">
        <h2>Similar {event.type === 'movie' ? 'Movies' : 'Events'}</h2>
        <div className="similar-grid">
          {['🎬', '🎭', '🎪'].map((emoji, idx) => (
            <div key={idx} className="similar-card">
              <div className="similar-image">{emoji}</div>
              <h4>Similar Event {idx + 1}</h4>
              <p className="similar-genre">Action • Adventure</p>
              <p className="similar-rating">⭐ 8.2</p>
              <button className="btn-view-similar">View Details</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
