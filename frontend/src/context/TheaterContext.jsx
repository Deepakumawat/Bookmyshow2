import React, { createContext, useContext, useState } from 'react';
import { theaters } from '../data/theaterData';

export const TheaterContext = createContext();

export function TheaterProvider({ children }) {
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [theaterReviews, setTheaterReviews] = useState({});

  // Initialize mock reviews
  const [allReviews] = useState({
    t1: [
      { id: 1, user: 'Amit K.', rating: 5, text: 'Amazing experience! Seats are comfortable.', date: '2024-12-15' },
      { id: 2, user: 'Priya S.', rating: 4, text: 'Good theater, but parking can be crowded.', date: '2024-12-14' },
      { id: 3, user: 'Rahul P.', rating: 5, text: 'Best IMAX experience in the city!', date: '2024-12-13' },
    ],
    t2: [
      { id: 1, user: 'Neha V.', rating: 4, text: 'Nice ambiance and friendly staff.', date: '2024-12-15' },
      { id: 2, user: 'Vikram M.', rating: 4, text: 'Good location and parking available.', date: '2024-12-14' },
    ],
    t3: [
      { id: 1, user: 'Anjali R.', rating: 5, text: 'Loved the 4DX experience!', date: '2024-12-15' },
      { id: 2, user: 'Akshay D.', rating: 3, text: 'Average snacks, good screens.', date: '2024-12-14' },
    ],
    t4: [
      { id: 1, user: 'Shreya N.', rating: 5, text: 'Premium experience at affordable price!', date: '2024-12-15' },
      { id: 2, user: 'Arjun S.', rating: 5, text: 'VIP lounge access is amazing.', date: '2024-12-14' },
      { id: 3, user: 'Divya K.', rating: 4, text: 'Great food options available.', date: '2024-12-13' },
    ],
  });

  const selectTheater = (theaterId) => {
    const theater = theaters.find((t) => t.id === theaterId);
    if (theater) {
      setSelectedTheater(theater);
      return theater;
    }
    return null;
  };

  const getTheaterReviews = (theaterId) => {
    return allReviews[theaterId] || [];
  };

  const addReview = (theaterId, review) => {
    const newReview = {
      id: Date.now(),
      ...review,
      date: new Date().toISOString().split('T')[0],
    };

    setTheaterReviews((prev) => ({
      ...prev,
      [theaterId]: [...(prev[theaterId] || []), newReview],
    }));

    return newReview;
  };

  const getAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <TheaterContext.Provider
      value={{
        selectedTheater,
        selectTheater,
        theaters,
        getTheaterReviews,
        addReview,
        getAverageRating,
      }}
    >
      {children}
    </TheaterContext.Provider>
  );
}

export function useTheater() {
  const context = useContext(TheaterContext);
  if (!context) {
    throw new Error('useTheater must be used within TheaterProvider');
  }
  return context;
}
