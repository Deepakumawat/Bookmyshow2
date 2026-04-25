export const offersDatabase = [
  {
    id: 'SUMMER40',
    code: 'SUMMER40',
    title: 'Summer Special - 40% Off',
    description: 'Get 40% discount on all movie bookings this summer',
    discountType: 'percentage',
    discountValue: 40,
    minCartValue: 0,
    maxDiscount: 500,
    applicableCategories: ['MOVIES'],
    applicableTheaters: [],
    minTier: 'BRONZE',
    expiryDate: '2024-06-30',
    usageLimit: 999,
    usageCount: 45,
    status: 'active',
    startDate: '2024-06-01',
    emoji: '☀️',
    color: '#F59E0B',
  },
  {
    id: 'LOYALITY50',
    code: 'LOYALITY50',
    title: 'Gold Member Special',
    description: 'Exclusive 50% off for Gold tier loyalty members',
    discountType: 'percentage',
    discountValue: 50,
    minCartValue: 500,
    maxDiscount: 1000,
    applicableCategories: ['MOVIES', 'EVENTS'],
    applicableTheaters: [],
    minTier: 'GOLD',
    expiryDate: '2024-12-31',
    usageLimit: 999,
    usageCount: 120,
    status: 'active',
    startDate: '2024-01-01',
    emoji: '⭐',
    color: '#FBBF24',
  },
  {
    id: 'PLATINUM200',
    code: 'PLATINUM200',
    title: 'Platinum Plus - ₹200 Off',
    description: 'Get ₹200 discount on bookings above ₹1000 for Platinum members',
    discountType: 'fixed',
    discountValue: 200,
    minCartValue: 1000,
    maxDiscount: 200,
    applicableCategories: ['MOVIES', 'EVENTS', 'PLAYS'],
    applicableTheaters: [],
    minTier: 'PLATINUM',
    expiryDate: '2024-12-31',
    usageLimit: 500,
    usageCount: 85,
    status: 'active',
    startDate: '2024-03-01',
    emoji: '👑',
    color: '#34D399',
  },
  {
    id: 'WEEKEND25',
    code: 'WEEKEND25',
    title: 'Weekend Bonanza - 25% Off',
    description: '25% discount on all bookings on weekends (Friday to Sunday)',
    discountType: 'percentage',
    discountValue: 25,
    minCartValue: 300,
    maxDiscount: 400,
    applicableCategories: ['MOVIES', 'EVENTS', 'PLAYS', 'SPORTS'],
    applicableTheaters: [],
    minTier: 'BRONZE',
    expiryDate: '2024-08-31',
    usageLimit: 999,
    usageCount: 210,
    status: 'active',
    startDate: '2024-06-01',
    validDaysOfWeek: [5, 6, 0], // Friday, Saturday, Sunday
    emoji: '🎉',
    color: '#EC4899',
  },
  {
    id: 'PAIRS30',
    code: 'PAIRS30',
    title: 'Couple Special - 30% Off',
    description: 'Book 2 tickets and get 30% discount',
    discountType: 'percentage',
    discountValue: 30,
    minCartValue: 600,
    maxDiscount: 500,
    minSeats: 2,
    applicableCategories: ['MOVIES'],
    applicableTheaters: [],
    minTier: 'BRONZE',
    expiryDate: '2024-08-30',
    usageLimit: 300,
    usageCount: 65,
    status: 'active',
    startDate: '2024-06-01',
    emoji: '💕',
    color: '#F472B6',
  },
  {
    id: 'NEWUSER100',
    code: 'NEWUSER100',
    title: 'New User Welcome - ₹100 Off',
    description: 'Get ₹100 off on your first booking',
    discountType: 'fixed',
    discountValue: 100,
    minCartValue: 500,
    maxDiscount: 100,
    applicableCategories: ['MOVIES', 'EVENTS', 'PLAYS'],
    applicableTheaters: [],
    minTier: 'BRONZE',
    firstTimeOnly: true,
    expiryDate: '2024-12-31',
    usageLimit: 999,
    usageCount: 450,
    status: 'active',
    startDate: '2024-01-01',
    emoji: '🎁',
    color: '#60A5FA',
  },
  {
    id: 'SILVER150',
    code: 'SILVER150',
    title: 'Silver Member Exclusive',
    description: '₹150 discount for Silver tier members on bookings above ₹750',
    discountType: 'fixed',
    discountValue: 150,
    minCartValue: 750,
    maxDiscount: 150,
    applicableCategories: ['MOVIES', 'EVENTS'],
    applicableTheaters: [],
    minTier: 'SILVER',
    expiryDate: '2024-09-30',
    usageLimit: 750,
    usageCount: 175,
    status: 'active',
    startDate: '2024-05-01',
    emoji: '🏅',
    color: '#A78BFA',
  },
  {
    id: 'TECH15',
    code: 'TECH15',
    title: '15% Tech-Friendly Discount',
    description: 'Book through mobile app and get 15% discount',
    discountType: 'percentage',
    discountValue: 15,
    minCartValue: 400,
    maxDiscount: 300,
    applicableCategories: ['MOVIES', 'EVENTS', 'PLAYS', 'SPORTS'],
    applicableTheaters: [],
    minTier: 'BRONZE',
    expiryDate: '2024-10-31',
    usageLimit: 999,
    usageCount: 320,
    status: 'active',
    startDate: '2024-04-01',
    channelRestriction: 'mobile',
    emoji: '📱',
    color: '#06B6D4',
  },
];

export const getActiveOffers = (filters = {}) => {
  const today = new Date();

  return offersDatabase.filter((offer) => {
    // Check if offer is active
    if (offer.status !== 'active') return false;

    // Check expiry date
    if (new Date(offer.expiryDate) < today) return false;

    // Check usage limit
    if (offer.usageCount >= offer.usageLimit) return false;

    // Apply filters
    if (filters.category && !offer.applicableCategories.includes(filters.category)) {
      return false;
    }

    if (filters.minTier) {
      const tierOrder = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
      const requiredIndex = tierOrder.indexOf(filters.minTier);
      const applicableIndex = tierOrder.indexOf(offer.minTier);
      if (requiredIndex < applicableIndex) return false;
    }

    if (filters.minAmount && filters.minAmount < offer.minCartValue) {
      return false;
    }

    return true;
  });
};

export const getOfferByCode = (code) => {
  return offersDatabase.find((offer) => offer.code === code.toUpperCase());
};

export const validateOfferCode = (code, bookingAmount, userTier, category) => {
  const offer = getOfferByCode(code);

  if (!offer) {
    return { valid: false, message: 'Invalid or expired offer code' };
  }

  if (offer.status !== 'active') {
    return { valid: false, message: 'This offer is no longer active' };
  }

  const today = new Date();
  if (new Date(offer.expiryDate) < today) {
    return { valid: false, message: 'This offer has expired' };
  }

  if (offer.usageCount >= offer.usageLimit) {
    return { valid: false, message: 'This offer has reached its usage limit' };
  }

  if (bookingAmount < offer.minCartValue) {
    return {
      valid: false,
      message: `Minimum cart value of ₹${offer.minCartValue} required for this offer`,
    };
  }

  if (category && !offer.applicableCategories.includes(category)) {
    return { valid: false, message: 'This offer is not applicable for this category' };
  }

  const tierOrder = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(offer.minTier);

  if (userTierIndex < requiredTierIndex) {
    return {
      valid: false,
      message: `This offer requires ${offer.minTier} tier or higher`,
    };
  }

  if (offer.validDaysOfWeek && !offer.validDaysOfWeek.includes(new Date().getDay())) {
    return { valid: false, message: 'This offer is only valid on specific days' };
  }

  return { valid: true };
};

export const calculateDiscount = (offer, bookingAmount) => {
  if (offer.discountType === 'percentage') {
    const discount = (bookingAmount * offer.discountValue) / 100;
    return Math.min(discount, offer.maxDiscount);
  } else if (offer.discountType === 'fixed') {
    return Math.min(offer.discountValue, offer.maxDiscount);
  }
  return 0;
};

export const getRecommendedOffers = (bookingAmount, userTier, category) => {
  return getActiveOffers({
    category,
    minTier: userTier,
    minAmount: bookingAmount,
  }).sort((a, b) => {
    // Sort by discount value descending
    const discountA = calculateDiscount(a, bookingAmount);
    const discountB = calculateDiscount(b, bookingAmount);
    return discountB - discountA;
  });
};
