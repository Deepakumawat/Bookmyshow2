import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateSeatPrice, getPricingMultipliers } from '../data/pricingTiers';

export const PricingContext = createContext();

export function PricingProvider({ children }) {
  const [bookingData, setBookingData] = useState({
    hoursUntilShow: 12,
    bookedSeats: 0,
    totalSeats: 150,
    isTrending: false,
    isWeekend: false,
  });

  const [priceMultiplier, setPriceMultiplier] = useState(1.0);

  useEffect(() => {
    const multiplier = getPricingMultipliers(bookingData);
    setPriceMultiplier(multiplier);
  }, [bookingData]);

  const calculatePrice = (seatTier) => {
    return calculateSeatPrice(seatTier, priceMultiplier);
  };

  const updateBookingData = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const getPriceBreakdown = (seats) => {
    const subtotal = seats.reduce((sum, seat) => sum + calculatePrice(seat.tier), 0);
    const taxes = Math.round(subtotal * 0.18);
    const total = subtotal + taxes;

    return {
      subtotal,
      taxes,
      total,
      breakdown: {
        basePrice: 300,
        multiplier: priceMultiplier.toFixed(2),
      },
    };
  };

  return (
    <PricingContext.Provider
      value={{
        bookingData,
        updateBookingData,
        priceMultiplier,
        calculatePrice,
        getPriceBreakdown,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within PricingProvider');
  }
  return context;
}
