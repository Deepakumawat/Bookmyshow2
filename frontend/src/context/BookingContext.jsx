import React, { createContext, useContext, useState } from 'react';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [currentBooking, setCurrentBooking] = useState({
    eventId: null,
    eventType: null, // 'movies', 'events', 'plays', 'sports', 'streaming'
    eventTitle: null,
    theaterId: null,
    theaterName: null,
    selectedDate: null,
    selectedShowtime: null,
    selectedSeats: [],
    totalPrice: 0,
    appliedPromoCode: null,
    discountAmount: 0,
    loyaltyPointsRedeemed: 0,
    selectedPaymentMethod: null,
  });

  const [bookingHistory, setBookingHistory] = useState(
    JSON.parse(localStorage.getItem('bookingHistory')) || []
  );

  const updateBooking = (updates) => {
    setCurrentBooking((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const addToHistory = (booking) => {
    const newBooking = {
      ...currentBooking,
      ...booking,
      bookingId: `BMS${Date.now()}`,
      bookingDate: new Date().toISOString(),
    };
    const updatedHistory = [newBooking, ...bookingHistory];
    setBookingHistory(updatedHistory);
    localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory));
    return newBooking;
  };

  const clearCurrentBooking = () => {
    setCurrentBooking({
      eventId: null,
      eventType: null,
      eventTitle: null,
      theaterId: null,
      theaterName: null,
      selectedDate: null,
      selectedShowtime: null,
      selectedSeats: [],
      totalPrice: 0,
      appliedPromoCode: null,
      discountAmount: 0,
      loyaltyPointsRedeemed: 0,
      selectedPaymentMethod: null,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        currentBooking,
        updateBooking,
        bookingHistory,
        addToHistory,
        clearCurrentBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
