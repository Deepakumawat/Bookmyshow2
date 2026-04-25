export const loyaltyTiers = {
  BRONZE: {
    tier: 'Bronze',
    minPoints: 0,
    pointMultiplier: 1.0,
    discountPercent: 0,
    benefits: ['Basic member', '1x points on bookings'],
  },
  SILVER: {
    tier: 'Silver',
    minPoints: 1000,
    pointMultiplier: 1.5,
    discountPercent: 2,
    benefits: ['1.5x points on bookings', '2% discount on all tickets', 'Priority customer support'],
  },
  GOLD: {
    tier: 'Gold',
    minPoints: 5000,
    pointMultiplier: 2.0,
    discountPercent: 5,
    benefits: ['2x points on bookings', '5% discount on all tickets', 'Free cancellation once a month'],
  },
  PLATINUM: {
    tier: 'Platinum',
    minPoints: 10000,
    pointMultiplier: 2.5,
    discountPercent: 10,
    benefits: ['2.5x points on bookings', '10% discount on all tickets', 'Free cancellation anytime', 'Exclusive preview access'],
  },
};

export const getTierByPoints = (points) => {
  if (points >= 10000) return loyaltyTiers.PLATINUM;
  if (points >= 5000) return loyaltyTiers.GOLD;
  if (points >= 1000) return loyaltyTiers.SILVER;
  return loyaltyTiers.BRONZE;
};

export const calculatePointsEarned = (bookingAmount, tier) => {
  const basePoints = Math.floor(bookingAmount / 10); // ₹10 = 1 point
  return Math.floor(basePoints * tier.pointMultiplier);
};

export const calculateDiscountFromPoints = (pointsToRedeem) => {
  // 100 points = 1% discount (max 50%)
  const discountPercent = Math.min(pointsToRedeem / 100, 50);
  return discountPercent;
};
