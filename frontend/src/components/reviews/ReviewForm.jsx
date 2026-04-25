import React, { useState } from 'react';
import './ReviewForm.css';

export function ReviewForm({ eventId, eventTitle, onSubmit, canSubmit = true }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !text.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        rating,
        title,
        text,
        userName: 'Current User', // In real app, get from UserContext
        userImage: '👤',
      };

      await onSubmit?.(eventId, reviewData);

      setSubmitSuccess(true);
      setTimeout(() => {
        setTitle('');
        setText('');
        setRating(5);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarSelector = () => {
    return (
      <div className="star-selector">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${rating >= star ? 'active' : ''}`}
            onClick={() => setRating(star)}
            title={`Rate ${star} stars`}
          >
            {rating >= star ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="review-form-container">
      <h3>Share Your Experience</h3>
      <p className="form-subtitle">Tell others what you thought about {eventTitle}</p>

      {submitSuccess && (
        <div className="success-message">✅ Review submitted successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          {renderStarSelector()}
        </div>

        <div className="form-group">
          <label htmlFor="title">Review Title</label>
          <input
            id="title"
            type="text"
            maxLength="100"
            placeholder="Summarize your review in a few words"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canSubmit || isSubmitting}
            className="form-input"
          />
          <small>{title.length}/100</small>
        </div>

        <div className="form-group">
          <label htmlFor="text">Your Review</label>
          <textarea
            id="text"
            maxLength="1000"
            rows="5"
            placeholder="Share your honest opinion. What did you like or dislike?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!canSubmit || isSubmitting}
            className="form-textarea"
          />
          <small>{text.length}/1000</small>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting || !title.trim() || !text.trim()}
            className="submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>

      {!canSubmit && (
        <div className="cannot-review-message">
          💬 You've already reviewed this event. You can only submit one review per event.
        </div>
      )}
    </div>
  );
}
