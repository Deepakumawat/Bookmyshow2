/**
 * Comprehensive Mock Data for BookMyShow Advanced
 * Covers all 10 features with realistic test data
 */

export const CATEGORIES = [
  { id: 1, name: 'Movies', icon: '🎬', color: '#E41B32' },
  { id: 2, name: 'Events', icon: '🎤', color: '#FF6B6B' },
  { id: 3, name: 'Plays', icon: '🎭', color: '#F97316' },
  { id: 4, name: 'Sports', icon: '⚽', color: '#3B82F6' },
  { id: 5, name: 'Streaming', icon: '📺', color: '#8B5CF6' }
];

export const MOVIES = [
  {
    id: 1,
    title: 'Dune: Part Two',
    genre: 'Sci-Fi, Action',
    language: 'English',
    duration: '166 min',
    rating: 'UA',
    year: 2024,
    poster: 'https://via.placeholder.com/300x450?text=Dune+Part+Two',
    description: 'Paul Atreides travels to the dangerous planet Arrakis to ensure the future of his family and people.',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Oscar Isaac'],
    releaseDate: '2024-02-25',
    imdbRating: 8.5,
    languages: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'],
    format: ['2D', 'IMAX'],
    shows: [
      { id: 101, time: '10:00 AM', price: 250 },
      { id: 102, time: '01:00 PM', price: 300 },
      { id: 103, time: '04:30 PM', price: 350 },
      { id: 104, time: '07:30 PM', price: 400 },
      { id: 105, time: '10:30 PM', price: 350 }
    ]
  },
  {
    id: 2,
    title: 'Bade Miyan Chote Miyan',
    genre: 'Action, Comedy',
    language: 'Hindi',
    duration: '143 min',
    rating: 'UA',
    year: 2024,
    poster: 'https://via.placeholder.com/300x450?text=Bade+Miyan',
    description: 'Two con artists team up to become unlikely heroes.',
    director: 'Ali Abbas Zafar',
    cast: ['Akshay Kumar', 'Dwayne Johnson'],
    releaseDate: '2024-04-10',
    imdbRating: 7.2,
    languages: ['Hindi'],
    format: ['2D'],
    shows: [
      { id: 201, time: '09:30 AM', price: 200 },
      { id: 202, time: '12:30 PM', price: 250 },
      { id: 203, time: '03:30 PM', price: 280 },
      { id: 204, time: '06:30 PM', price: 320 },
      { id: 205, time: '09:30 PM', price: 300 }
    ]
  },
  {
    id: 3,
    title: 'The Brutalist',
    genre: 'Drama',
    language: 'English',
    duration: '215 min',
    rating: '12A',
    year: 2024,
    poster: 'https://via.placeholder.com/300x450?text=The+Brutalist',
    description: 'An epic tale of ambition and American enterprise.',
    director: 'Brady Corbet',
    cast: ['Adrien Brody', 'Guy Pearce'],
    releaseDate: '2024-01-15',
    imdbRating: 8.9,
    languages: ['English'],
    format: ['2D', '70mm'],
    shows: [
      { id: 301, time: '01:00 PM', price: 400 },
      { id: 302, time: '05:00 PM', price: 450 }
    ]
  }
];

export const THEATRES = [
  {
    id: 1,
    name: 'PVR Cinemas',
    city: 'Mumbai',
    address: 'Inorbit Mall, Vile Parle, Mumbai',
    screens: 8,
    rating: 4.6,
    reviews: 2543,
    amenities: ['WiFi', 'Parking', 'Food Court', 'Wheelchair Accessible'],
    avgPrice: 300
  },
  {
    id: 2,
    name: 'IMAX Mumbai',
    city: 'Mumbai',
    address: 'Forum Multiplex, Koregaon Park, Mumbai',
    screens: 4,
    rating: 4.8,
    reviews: 1890,
    amenities: ['WiFi', 'Premium Seating', 'IMAX Technology', 'Parking'],
    avgPrice: 500
  },
  {
    id: 3,
    name: 'Cinepolis',
    city: 'Bangalore',
    address: 'Forum Value Mall, Whitefield, Bangalore',
    screens: 12,
    rating: 4.4,
    reviews: 3210,
    amenities: ['WiFi', 'Parking', 'Food Court', 'Kids Zone'],
    avgPrice: 280
  },
  {
    id: 4,
    name: 'Big Cinemas',
    city: 'Delhi',
    address: 'Select City Walk, Saket, New Delhi',
    screens: 10,
    rating: 4.5,
    reviews: 2678,
    amenities: ['WiFi', 'Parking', 'Premium Lounge', 'Wheelchair Accessible'],
    avgPrice: 320
  }
];

export const SEAT_LAYOUT = {
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  columns: 15,
  tiers: {
    standard: { rows: ['A', 'B', 'I', 'J'], price: 200 },
    premium: { rows: ['C', 'D', 'E', 'F', 'G', 'H'], price: 350 }
  }
};

export const LOYALTY_TIERS = [
  {
    id: 1,
    name: 'Silver',
    minPoints: 0,
    benefits: ['1 point per rupee', 'Birthday discount'],
    color: '#C0C0C0'
  },
  {
    id: 2,
    name: 'Gold',
    minPoints: 1000,
    benefits: ['1.5 points per rupee', 'Early show access', '5% redemption discount'],
    color: '#FFD700'
  },
  {
    id: 3,
    name: 'Platinum',
    minPoints: 5000,
    benefits: ['2 points per rupee', 'VIP shows', '10% redemption discount', 'Priority booking'],
    color: '#E5E4E2'
  }
];

export const PAYMENT_METHODS = [
  { id: 1, type: 'card', name: 'Visa **** 1234', lastUsed: '2024-04-15' },
  { id: 2, type: 'card', name: 'MasterCard **** 5678', lastUsed: '2024-04-10' },
  { id: 3, type: 'upi', name: 'user@paytm', lastUsed: '2024-04-05' },
  { id: 4, type: 'wallet', name: 'BookMyShow Wallet (₹1250)', lastUsed: '2024-04-01' }
];

export const OFFERS = [
  {
    id: 1,
    code: 'WEEKEND50',
    title: '50% off on weekend shows',
    description: 'Get 50% off on all shows on Friday, Saturday and Sunday',
    discount: 50,
    type: 'percentage',
    minCartValue: 400,
    maxDiscount: 200,
    applicableOn: ['Movies', 'Events'],
    validTill: '2024-12-31',
    usageCount: 0,
    usageLimit: 50,
    image: 'https://via.placeholder.com/150x100?text=Weekend+Offer'
  },
  {
    id: 2,
    code: 'LOYALTY20',
    title: 'Loyalty Bonus - 20% off',
    description: 'Exclusive offer for Gold and Platinum members',
    discount: 20,
    type: 'percentage',
    minCartValue: 300,
    maxDiscount: 150,
    applicableOn: ['Movies', 'Events', 'Plays'],
    validTill: '2024-12-31',
    loyaltyTierRequired: 'Gold',
    image: 'https://via.placeholder.com/150x100?text=Loyalty+Offer'
  },
  {
    id: 3,
    code: 'FIRST200',
    title: 'Flat ₹200 off',
    description: 'First-time user offer - Get ₹200 flat discount',
    discount: 200,
    type: 'amount',
    minCartValue: 500,
    maxDiscount: 200,
    applicableOn: 'All',
    validTill: '2024-12-31',
    newUserOnly: true,
    image: 'https://via.placeholder.com/150x100?text=First+Time'
  },
  {
    id: 4,
    code: 'COUPLE100',
    title: '₹100 off on couple packages',
    description: 'Book 2 tickets and get ₹100 off',
    discount: 100,
    type: 'amount',
    minCartValue: 0,
    maxDiscount: 100,
    applicableOn: ['Movies', 'Events'],
    validTill: '2024-12-31',
    minTickets: 2,
    image: 'https://via.placeholder.com/150x100?text=Couple+Offer'
  }
];

export const REVIEWS = [
  {
    id: 1,
    theatreId: 1,
    userId: 101,
    userName: 'Rajesh Kumar',
    rating: 5,
    date: '2024-04-15',
    text: 'Excellent experience! Great sound system and comfortable seats.',
    helpful: 234
  },
  {
    id: 2,
    theatreId: 1,
    userId: 102,
    userName: 'Priya Singh',
    rating: 4,
    date: '2024-04-14',
    text: 'Good theatre but parking could be better.',
    helpful: 156
  },
  {
    id: 3,
    theatreId: 2,
    userId: 103,
    userName: 'Amit Patel',
    rating: 5,
    date: '2024-04-13',
    text: 'IMAX experience is mind-blowing! Worth every penny.',
    helpful: 456
  }
];

export const BOOKING_HISTORY = [
  {
    id: 'BK001',
    movieTitle: 'Dune: Part Two',
    theatreName: 'PVR Cinemas',
    date: '2024-04-20',
    time: '07:30 PM',
    seats: ['E5', 'E6'],
    totalPrice: 700,
    status: 'Confirmed',
    bookingDate: '2024-04-15',
    ticketId: 'TK123456',
    showId: 104
  },
  {
    id: 'BK002',
    movieTitle: 'Bade Miyan Chote Miyan',
    theatreName: 'Cinepolis',
    date: '2024-04-25',
    time: '06:30 PM',
    seats: ['C3', 'C4', 'C5'],
    totalPrice: 900,
    status: 'Confirmed',
    bookingDate: '2024-04-10',
    ticketId: 'TK123457',
    showId: 204
  },
  {
    id: 'BK003',
    movieTitle: 'The Brutalist',
    theatreName: 'IMAX Mumbai',
    date: '2024-04-22',
    time: '05:00 PM',
    seats: ['B4', 'B5'],
    totalPrice: 900,
    status: 'Cancelled',
    bookingDate: '2024-04-16',
    cancelledDate: '2024-04-18',
    refundAmount: 900,
    reason: 'User cancelled'
  }
];

export const NOTIFICATIONS_DATA = [
  {
    id: 1,
    type: 'booking_confirmation',
    title: 'Booking Confirmed!',
    message: 'Your booking for Dune: Part Two is confirmed. Ticket sent to your email.',
    date: '2024-04-15',
    read: false,
    icon: '✓'
  },
  {
    id: 2,
    type: 'offer_alert',
    title: 'Exciting Offer!',
    message: 'Get 50% off on weekend shows with code WEEKEND50',
    date: '2024-04-14',
    read: false,
    icon: '🎉'
  },
  {
    id: 3,
    type: 'loyalty_points',
    title: 'Points Earned!',
    message: 'You earned 350 loyalty points from your last booking.',
    date: '2024-04-10',
    read: true,
    icon: '⭐'
  }
];

export const PRICING_TIERS = [
  { seatClass: 'Standard', basePriceMultiplier: 1.0, color: '#10B981' },
  { seatClass: 'Premium', basePriceMultiplier: 1.75, color: '#F59E0B' },
  { seatClass: 'VIP', basePriceMultiplier: 2.5, color: '#EC4899' }
];

export const FILTER_OPTIONS = {
  Movies: {
    genre: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi'],
    rating: ['U', 'UA', 'A', '12A', '15', '18'],
    year: [2024, 2023, 2022, 2021, 2020]
  },
  Events: {
    category: ['Concert', 'Comedy', 'Sports', 'Plays', 'Workshops'],
    priceRange: [{ min: 0, max: 500 }, { min: 500, max: 1000 }, { min: 1000, max: 5000 }]
  },
  Plays: {
    genre: ['Comedy', 'Drama', 'Musical', 'Thriller'],
    language: ['English', 'Hindi', 'Marathi'],
    duration: ['Under 2 hours', '2-3 hours', 'Over 3 hours']
  }
};

export const EMI_PLANS = [
  { months: 3, interestRate: 0, minAmount: 5000 },
  { months: 6, interestRate: 2, minAmount: 8000 },
  { months: 12, interestRate: 4, minAmount: 10000 }
];
