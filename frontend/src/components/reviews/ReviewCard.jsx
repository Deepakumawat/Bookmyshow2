import React, { useState } from 'react';
import './ReviewCard.css';

export function ReviewCard({ review, onHelpful, onUnhelpful, canMarkHelpful = true }) {
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);
  const [hasMarkedUnhelpful, setHasMarkedUnhelpful] = useState(false);

  const handleHelpful = () => {
    if (!hasMarkedHelpful) {
      onHelpful?.(review.id);
      setHasMarkedHelpful(true);
    }
  };

  const handleUnhelpful = () => {
    if (!hasMarkedUnhelpful) {
      onUnhelpful?.(review.id);
      setHasMarkedUnhelpful(true);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <span className="reviewer-avatar">{review.userImage}</span>
          <div className="reviewer-details">
            <div className="reviewer-name">
              {review.userName}
              {review.verified && <span className="verified-badge">✓ Verified</span>}
            </div>
            <div className="review-date">{formatDate(review.createdAt)}</div>
          </div>
        </div>
        <div className="review-rating">{renderStars(review.rating)}</div>
      </div>

      <div className="review-content">
        <h4 className="review-title">{review.title}</h4>
        <p className="review-text">{review.text}</p>
      </div>

      <div className="review-footer">
        <button
          className={`helpful-btn ${hasMarkedHelpful ? 'marked' : ''}`}
          onClick={handleHelpful}
          disabled={!canMarkHelpful || hasMarkedHelpful}
          title="Mark as helpful"
        >
          👍 Helpful ({review.helpfulVotes})
        </button>
        <button
          className={`unhelpful-btn ${hasMarkedUnhelpful ? 'marked' : ''}`}
          onClick={handleUnhelpful}
          disabled={!canMarkHelpful || hasMarkedUnhelpful}
          title="Mark as unhelpful"
        >
          👎 Not helpful ({review.unhelpfulVotes})
        </button>
      </div>
    </div>
  );
}
