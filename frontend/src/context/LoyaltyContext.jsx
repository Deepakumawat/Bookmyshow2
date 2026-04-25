import React, { createContext, useContext, useState } from 'react';
import { getTierByPoints, calculatePointsEarned, loyaltyTiers } from '../data/loyaltyProgram';

export const LoyaltyContext = createContext();

export function LoyaltyProvider({ children }) {
  const [loyaltyState, setLoyaltyState] = useState({
    totalPoints: 2500,
    pointsHistory: [],
    currentTier: getTierByPoints(2500),
    redeemablePoints: 2500,
    lastUpdated: new Date(),
  });

  const earnPoints = (bookingAmount) => {
    const pointsEarned = calculatePointsEarned(bookingAmount, loyaltyState.currentTier);
    const newTotal = loyaltyState.totalPoints + pointsEarned;
    const newTier = getTierByPoints(newTotal);
    const tierUpgraded = newTier.tier !== loyaltyState.currentTier.tier;

    const newHistory = [
      {
        id: `txn_${Date.now()}`,
        type: 'earn',
        points: pointsEarned,
        amount: bookingAmount,
        date: new Date(),
        description: `Points earned from booking`,
      },
      ...loyaltyState.pointsHistory,
    ];

    setLoyaltyState({
      totalPoints: newTotal,
      redeemablePoints: newTotal,
      pointsHistory: newHistory,
      currentTier: newTier,
      lastUpdated: new Date(),
    });

    return { pointsEarned, tierUpgraded, newTier };
  };

  const redeemPoints = (pointsToRedeem, discountAmount) => {
    if (pointsToRedeem > loyaltyState.redeemablePoints) {
      return { success: false, message: 'Insufficient points' };
    }

    const newHistory = [
      {
        id: `txn_${Date.now()}`,
        type: 'redeem',
        points: -pointsToRedeem,
        discount: discountAmount,
        date: new Date(),
        description: `Points redeemed for ₹${discountAmount} discount`,
      },
      ...loyaltyState.pointsHistory,
    ];

    const newTotal = loyaltyState.totalPoints - pointsToRedeem;
    const newTier = getTierByPoints(newTotal);

    setLoyaltyState({
      totalPoints: newTotal,
      redeemablePoints: newTotal,
      pointsHistory: newHistory,
      currentTier: newTier,
      lastUpdated: new Date(),
    });

    return { success: true, pointsRedeemed: pointsToRedeem, discountAmount };
  };

  const getPointsToNextTier = () => {
    const nextTierPoints = Object.values(loyaltyTiers)
      .filter((t) => t.minPoints > loyaltyState.totalPoints)
      .sort((a, b) => a.minPoints - b.minPoints)[0]?.minPoints;

    if (!nextTierPoints) return null;
    return nextTierPoints - loyaltyState.totalPoints;
  };

  return (
    <LoyaltyContext.Provider
      value={{
        loyaltyState,
        earnPoints,
        redeemPoints,
        getPointsToNextTier,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within LoyaltyProvider');
  }
  return context;
}
