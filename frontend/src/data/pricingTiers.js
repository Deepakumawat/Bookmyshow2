export const pricingTiers = {
  STANDARD: { id: 'standard', multiplier: 1.0, label: 'Standard' },
  PREMIUM: { id: 'premium', multiplier: 1.5, label: 'Premium' },
  VIP: { id: 'vip', multiplier: 2.0, label: 'VIP' },
  EXECUTIVE: { id: 'executive', multiplier: 2.8, label: 'Executive Recliner' },
};

export const basePrice = 300;

// Multipliers for dynamic pricing
export const getPricingMultipliers = (bookingData) => {
  let multiplier = 1.0;

  // Time-based multiplier (closer to showtime = more expensive)
  if (bookingData.hoursUntilShow <= 2) multiplier *= 1.5;
  else if (bookingData.hoursUntilShow <= 6) multiplier *= 1.25;
  else if (bookingData.hoursUntilShow <= 24) multiplier *= 1.1;

  // Occupancy-based multiplier (fewer seats = more expensive)
  const occupancyRate = bookingData.bookedSeats / bookingData.totalSeats;
  if (occupancyRate > 0.8) multiplier *= 1.3;
  else if (occupancyRate > 0.6) multiplier *= 1.15;
  else if (occupancyRate > 0.4) multiplier *= 1.05;

  // Demand-based multiplier (popular shows cost more)
  if (bookingData.isTrending) multiplier *= 1.2;
  if (bookingData.isWeekend) multiplier *= 1.1;

  return multiplier;
};

export const calculateSeatPrice = (seatTier, baseMultiplier = 1.0) => {
  const tier = pricingTiers[seatTier.toUpperCase()];
  if (!tier) return basePrice;
  return Math.round(basePrice * tier.multiplier * baseMultiplier);
};
