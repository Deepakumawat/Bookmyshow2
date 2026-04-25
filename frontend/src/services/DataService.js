/**
 * Data Service Layer
 * Provides mock data with fallback to API
 * Ensures application works with or without backend
 */

import {
  MOVIES,
  THEATRES,
  OFFERS,
  LOYALTY_TIERS,
  BOOKING_HISTORY,
  NOTIFICATIONS_DATA,
  REVIEWS,
  PAYMENT_METHODS,
  CATEGORIES,
  FILTER_OPTIONS,
  EMI_PLANS,
  PRICING_TIERS,
  SEAT_LAYOUT,
} from '../data/mockData';
import api from './api';

class DataService {
  /**
   * Get all movies with shows
   */
  async getMovies(filters = {}) {
    try {
      // First try backend
      const shows = await api.getShows();
      return shows;
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock movie data:', error.message);
      let movies = MOVIES;

      if (filters.genre) {
        movies = movies.filter(m => m.genre.includes(filters.genre));
      }
      if (filters.language) {
        movies = movies.filter(m => m.languages.includes(filters.language));
      }
      if (filters.rating) {
        movies = movies.filter(m => m.rating === filters.rating);
      }

      return movies;
    }
  }

  /**
   * Get single movie details
   */
  async getMovieById(id) {
    try {
      const movie = await api.getShowById(id);
      return movie;
    } catch (error) {
      console.warn('Using mock movie data for ID:', id);
      return MOVIES.find(m => m.id === parseInt(id));
    }
  }

  /**
   * Get all theatres
   */
  async getTheatres(city = null) {
    try {
      return await api.getTheatres(city);
    } catch (error) {
      console.warn('Using mock theatre data:', error.message);
      let theatres = THEATRES;

      if (city) {
        theatres = theatres.filter(t => t.city.toLowerCase() === city.toLowerCase());
      }

      return theatres;
    }
  }

  /**
   * Get theatre details
   */
  async getTheatreById(id) {
    try {
      return await api.getTheatreById(id);
    } catch (error) {
      console.warn('Using mock theatre data for ID:', id);
      const theatre = THEATRES.find(t => t.id === parseInt(id));
      if (theatre) {
        return {
          ...theatre,
          reviews: REVIEWS.filter(r => r.theatreId === parseInt(id)),
        };
      }
      return null;
    }
  }

  /**
   * Get offers available to user
   */
  async getOffers(filters = {}) {
    const allOffers = OFFERS;
    let availableOffers = allOffers;

    // Filter by category
    if (filters.category) {
      availableOffers = availableOffers.filter(offer =>
        offer.applicableOn === 'All' || offer.applicableOn.includes(filters.category)
      );
    }

    // Filter by loyalty tier
    if (filters.loyaltyTier && filters.loyaltyTier !== 'Silver') {
      availableOffers = availableOffers.filter(offer =>
        !offer.loyaltyTierRequired || offer.loyaltyTierRequired === filters.loyaltyTier
      );
    }

    // Filter by new user
    if (filters.isNewUser) {
      availableOffers = availableOffers.filter(offer =>
        !offer.newUserOnly || offer.newUserOnly === true
      );
    }

    return availableOffers;
  }

  /**
   * Validate promo code
   */
  validatePromoCode(code, cartValue = 0, context = {}) {
    const offer = OFFERS.find(o => o.code.toUpperCase() === code.toUpperCase());

    if (!offer) {
      return { valid: false, error: 'Invalid promo code' };
    }

    if (cartValue < offer.minCartValue) {
      return {
        valid: false,
        error: `Minimum cart value ₹${offer.minCartValue} required`,
      };
    }

    if (offer.usageCount >= offer.usageLimit) {
      return { valid: false, error: 'This offer has expired' };
    }

    if (offer.newUserOnly && !context.isNewUser) {
      return { valid: false, error: 'This offer is for new users only' };
    }

    const discount = offer.type === 'percentage'
      ? Math.min((cartValue * offer.discount) / 100, offer.maxDiscount)
      : Math.min(offer.discount, offer.maxDiscount);

    return {
      valid: true,
      offer,
      discount,
      finalPrice: cartValue - discount,
    };
  }

  /**
   * Get user's booking history
   */
  async getBookingHistory() {
    try {
      return await api.getBookings();
    } catch (error) {
      console.warn('Using mock booking history:', error.message);
      return BOOKING_HISTORY;
    }
  }

  /**
   * Get booking details
   */
  async getBookingById(id) {
    try {
      return await api.getBookingById(id);
    } catch (error) {
      console.warn('Using mock booking data for ID:', id);
      return BOOKING_HISTORY.find(b => b.id === id);
    }
  }

  /**
   * Create a booking
   */
  async createBooking(bookingData) {
    try {
      return await api.createBooking(bookingData);
    } catch (error) {
      console.warn('Using mock booking creation');
      return {
        id: 'BK' + Date.now(),
        ...bookingData,
        status: 'Confirmed',
        bookingDate: new Date().toISOString(),
      };
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(id) {
    try {
      return await api.cancelBooking(id);
    } catch (error) {
      console.warn('Using mock booking cancellation');
      return { id, status: 'Cancelled', refundAmount: 0 };
    }
  }

  /**
   * Get loyalty information
   */
  getLoyaltyInfo() {
    return {
      tiers: LOYALTY_TIERS,
      currentTier: LOYALTY_TIERS[1], // Gold
      currentPoints: 2350,
      pointsEarned: 350,
      pointsExpired: 50,
      nextTierPoints: 5000 - 2350,
    };
  }

  /**
   * Get user's payment methods
   */
  async getPaymentMethods() {
    return PAYMENT_METHODS;
  }

  /**
   * Get seat layout for a show
   */
  getSeatLayout() {
    return SEAT_LAYOUT;
  }

  /**
   * Get pricing tiers
   */
  getPricingTiers() {
    return PRICING_TIERS;
  }

  /**
   * Calculate dynamic price
   */
  calculatePrice(basePriceMultiplier, dayOfWeek, occupancyPercent, tierMultiplier = 1) {
    let basePrice = 300; // Base price in rupees

    // Apply tier multiplier (standard, premium, VIP)
    basePrice = basePrice * basePriceMultiplier;

    // Weekend surge pricing
    if (['Friday', 'Saturday', 'Sunday'].includes(dayOfWeek)) {
      basePrice = basePrice * 1.2;
    }

    // Occupancy-based surge pricing
    if (occupancyPercent > 80) {
      basePrice = basePrice * 1.3;
    } else if (occupancyPercent > 60) {
      basePrice = basePrice * 1.15;
    }

    return Math.ceil(basePrice);
  }

  /**
   * Get filter options for category
   */
  getFilterOptions(category) {
    return FILTER_OPTIONS[category] || {};
  }

  /**
   * Get EMI plans
   */
  getEMIPlans() {
    return EMI_PLANS;
  }

  /**
   * Calculate EMI
   */
  calculateEMI(amount, months, interestRate) {
    const monthlyRate = interestRate / 100 / 12;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months))
      / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.ceil(emi);
  }

  /**
   * Get notifications
   */
  async getNotifications() {
    return NOTIFICATIONS_DATA;
  }

  /**
   * Get theatre reviews
   */
  async getTheatreReviews(theatreId) {
    try {
      return await api.getTheatreReviews(theatreId);
    } catch (error) {
      console.warn('Using mock reviews');
      return REVIEWS.filter(r => r.theatreId === parseInt(theatreId));
    }
  }

  /**
   * Submit review
   */
  async submitReview(theatreId, review) {
    try {
      return await api.submitReview(theatreId, review);
    } catch (error) {
      console.warn('Using mock review submission');
      return {
        id: REVIEWS.length + 1,
        theatreId,
        ...review,
        date: new Date().toISOString().split('T')[0],
      };
    }
  }

  /**
   * Get available cities
   */
  getAvailableCities() {
    return [...new Set(THEATRES.map(t => t.city))];
  }

  /**
   * Get categories
   */
  getCategories() {
    return CATEGORIES;
  }
}

export default new DataService();
