import React, { createContext, useContext, useState, useEffect } from 'react';
import { addReview as addReviewToDb } from '../data/reviewsData';

export const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [userReviews, setUserReviews] = useState([]);
  const [submittedReviewIds, setSubmittedReviewIds] = useState([]);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userReviews');
    if (saved) {
      try {
        setUserReviews(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load user reviews:', e);
      }
    }

    const savedIds = localStorage.getItem('submittedReviewIds');
    if (savedIds) {
      try {
        setSubmittedReviewIds(JSON.parse(savedIds));
      } catch (e) {
        console.error('Failed to load submitted review IDs:', e);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
  }, [userReviews]);

  useEffect(() => {
    localStorage.setItem('submittedReviewIds', JSON.stringify(submittedReviewIds));
  }, [submittedReviewIds]);

  const submitReview = (eventId, reviewData) => {
    const newReview = {
      id: `rev_${Date.now()}`,
      eventId,
      ...reviewData,
      createdAt: new Date(),
      status: 'pending',
      helpfulVotes: 0,
      unhelpfulVotes: 0,
    };

    setUserReviews((prev) => [newReview, ...prev]);
    setSubmittedReviewIds((prev) => [...prev, eventId]);

    return newReview;
  };

  const canSubmitReview = (eventId) => {
    return !submittedReviewIds.includes(eventId);
  };

  const getUserReview = (eventId) => {
    return userReviews.find((review) => review.eventId === eventId);
  };

  const updateReview = (reviewId, updates) => {
    setUserReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, ...updates } : review
      )
    );
  };

  const deleteReview = (reviewId) => {
    const review = userReviews.find((r) => r.id === reviewId);
    setUserReviews((prev) => prev.filter((r) => r.id !== reviewId));

    if (review) {
      setSubmittedReviewIds((prev) =>
        prev.filter((id) => id !== review.eventId)
      );
    }
  };

  const markReviewAsHelpful = (reviewId) => {
    updateReview(reviewId, {
      helpfulVotes: (userReviews.find((r) => r.id === reviewId)?.helpfulVotes || 0) + 1,
    });
  };

  const markReviewAsUnhelpful = (reviewId) => {
    updateReview(reviewId, {
      unhelpfulVotes: (userReviews.find((r) => r.id === reviewId)?.unhelpfulVotes || 0) + 1,
    });
  };

  const getUserReviewsCount = () => {
    return userReviews.length;
  };

  const getAverageUserRating = () => {
    if (userReviews.length === 0) return 0;
    const sum = userReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / userReviews.length).toFixed(1);
  };

  return (
    <ReviewContext.Provider
      value={{
        userReviews,
        submittedReviewIds,
        submitReview,
        canSubmitReview,
        getUserReview,
        updateReview,
        deleteReview,
        markReviewAsHelpful,
        markReviewAsUnhelpful,
        getUserReviewsCount,
        getAverageUserRating,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within ReviewProvider');
  }
  return context;
}
