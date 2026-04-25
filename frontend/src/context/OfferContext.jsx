import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateOfferCode, calculateDiscount, getOfferByCode } from '../data/offers';

export const OfferContext = createContext();

export function OfferProvider({ children }) {
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [appliedCode, setAppliedCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [offerError, setOfferError] = useState(null);
  const [recentCodes, setRecentCodes] = useState([]);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentCodes');
    if (saved) {
      try {
        setRecentCodes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent codes:', e);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('recentCodes', JSON.stringify(recentCodes));
  }, [recentCodes]);

  const applyOffer = (code, bookingAmount, userTier, category) => {
    setOfferError(null);

    const validation = validateOfferCode(code, bookingAmount, userTier, category);

    if (!validation.valid) {
      setOfferError(validation.message);
      return { success: false, message: validation.message };
    }

    const offer = getOfferByCode(code);
    const discount = calculateDiscount(offer, bookingAmount);

    setAppliedOffer(offer);
    setAppliedCode(code);
    setDiscountAmount(discount);

    // Add to recent codes
    if (!recentCodes.includes(code)) {
      setRecentCodes((prev) => [code, ...prev.slice(0, 4)]);
    }

    return {
      success: true,
      offer,
      discount,
      message: `Offer applied! You saved ₹${discount.toFixed(2)}`,
    };
  };

  const removeOffer = () => {
    setAppliedOffer(null);
    setAppliedCode('');
    setDiscountAmount(0);
    setOfferError(null);
  };

  const getAppliedOfferDetails = () => {
    if (!appliedOffer) return null;

    return {
      code: appliedCode,
      title: appliedOffer.title,
      description: appliedOffer.description,
      discount: discountAmount,
      discountType: appliedOffer.discountType,
      discountValue: appliedOffer.discountValue,
      maxDiscount: appliedOffer.maxDiscount,
    };
  };

  const calculateFinalPrice = (originalPrice) => {
    return Math.max(0, originalPrice - discountAmount);
  };

  return (
    <OfferContext.Provider
      value={{
        appliedOffer,
        appliedCode,
        discountAmount,
        offerError,
        recentCodes,
        applyOffer,
        removeOffer,
        getAppliedOfferDetails,
        calculateFinalPrice,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
}

export function useOffer() {
  const context = useContext(OfferContext);
  if (!context) {
    throw new Error('useOffer must be used within OfferProvider');
  }
  return context;
}
