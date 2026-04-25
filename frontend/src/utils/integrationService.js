/**
 * Integration Service - Connects all phases of the BookMyShow application
 * Handles data flow between discovery, booking, loyalty, and notifications
 */

export class IntegrationService {
  // Navigate from recommendation to event details
  static navigateToEventDetails(eventId) {
    window.location.href = `/event/${eventId}`;
  }

  // Navigate from event details to booking
  static navigateToBooking(eventId, eventTitle) {
    sessionStorage.setItem('selectedEvent', JSON.stringify({
      eventId,
      eventTitle,
      timestamp: Date.now(),
    }));
    window.location.href = '/booking';
  }

  // Get event from session storage (set during booking navigation)
  static getSelectedEvent() {
    const event = sessionStorage.getItem('selectedEvent');
    return event ? JSON.parse(event) : null;
  }

  // Clear selected event from session
  static clearSelectedEvent() {
    sessionStorage.removeItem('selectedEvent');
  }

  // Handle booking completion and loyalty points
  static handleBookingCompletion(bookingData) {
    return {
      bookingId: `BK_${Date.now()}`,
      pointsEarned: Math.floor((bookingData.totalPrice / 100) * 50), // Example: 50 points per ₹100
      loyaltyTierBefore: bookingData.loyaltyTier,
      timestamp: Date.now(),
      ...bookingData,
    };
  }

  // Add booking to history and update loyalty
  static addBookingToHistory(bookingData, loyaltyContext, bookingHistoryContext) {
    const completedBooking = this.handleBookingCompletion(bookingData);

    // Update booking history
    if (bookingHistoryContext?.addBooking) {
      bookingHistoryContext.addBooking(completedBooking);
    }

    // Update loyalty points
    if (loyaltyContext?.addPoints) {
      loyaltyContext.addPoints(completedBooking.pointsEarned, completedBooking.bookingId);
    }

    return completedBooking;
  }

  // Create notification from booking
  static createBookingNotification(bookingData) {
    return {
      id: `NOTIF_${Date.now()}`,
      type: 'booking',
      title: 'Booking Confirmation',
      message: `Your tickets for ${bookingData.eventTitle} have been booked successfully`,
      icon: '✅',
      timestamp: new Date(),
      read: false,
      relatedBookingId: bookingData.bookingId,
    };
  }

  // Create loyalty notification
  static createLoyaltyNotification(pointsEarned, tierName) {
    return {
      id: `NOTIF_${Date.now()}`,
      type: 'loyalty',
      title: 'Points Earned',
      message: `You earned ${pointsEarned} loyalty points. You are now ${tierName} member!`,
      icon: '⭐',
      timestamp: new Date(),
      read: false,
    };
  }

  // Navigate to loyalty from booking confirmation
  static navigateToLoyalty() {
    window.location.href = '/loyalty';
  }

  // Navigate to notifications
  static navigateToNotifications() {
    window.location.href = '/notifications';
  }

  // Check if user can submit review (has booked the event)
  static canSubmitReview(eventId, bookingHistory) {
    return bookingHistory?.some((booking) => booking.eventId === eventId) || false;
  }

  // Navigate from event details to write review
  static navigateToReview(eventId) {
    sessionStorage.setItem('reviewEventId', eventId);
    const reviewElement = document.getElementById('review-form');
    reviewElement?.scrollIntoView({ behavior: 'smooth' });
  }

  // Get recommended events based on browsing history
  static getRecommendedEventsForUser(userProfile, bookingHistory, recommendationEngine) {
    if (!recommendationEngine) return [];
    return recommendationEngine.getPersonalizedRecommendations(
      bookingHistory?.map((b) => b.event) || [],
      6
    );
  }

  // Handle wishlist to booking flow
  static navigateFromWishlistToBooking(event) {
    sessionStorage.setItem('selectedEvent', JSON.stringify({
      eventId: event.id,
      eventTitle: event.title,
      fromWishlist: true,
      timestamp: Date.now(),
    }));
    window.location.href = '/booking';
  }

  // Handle event details to wishlist
  static toggleWishlistFromEventDetails(event, wishlistContext) {
    if (wishlistContext?.isInWishlist(event.id)) {
      wishlistContext.removeFromWishlist(event.id);
      return { action: 'removed', message: 'Removed from wishlist' };
    } else {
      wishlistContext.addToWishlist(event);
      return { action: 'added', message: 'Added to wishlist' };
    }
  }

  // Navigate with context preservation
  static navigateWithContext(path, context) {
    sessionStorage.setItem('navigationContext', JSON.stringify(context));
    window.location.href = path;
  }

  // Retrieve navigation context
  static getNavigationContext() {
    const context = sessionStorage.getItem('navigationContext');
    return context ? JSON.parse(context) : null;
  }

  // Clear navigation context
  static clearNavigationContext() {
    sessionStorage.removeItem('navigationContext');
  }

  // Track user journey
  static trackJourney(event, stage) {
    const journey = JSON.parse(sessionStorage.getItem('userJourney') || '[]');
    journey.push({
      stage,
      eventId: event?.id,
      eventTitle: event?.title,
      timestamp: Date.now(),
    });
    sessionStorage.setItem('userJourney', JSON.stringify(journey));
    return journey;
  }

  // Get user journey
  static getJourney() {
    return JSON.parse(sessionStorage.getItem('userJourney') || '[]');
  }

  // Clear journey
  static clearJourney() {
    sessionStorage.removeItem('userJourney');
  }

  // Complete booking and redirect with flow
  static completeBookingAndNotify(
    bookingData,
    loyaltyContext,
    bookingHistoryContext,
    notificationContext
  ) {
    // Add booking to history
    const completedBooking = this.addBookingToHistory(
      bookingData,
      loyaltyContext,
      bookingHistoryContext
    );

    // Create notifications
    const bookingNotif = this.createBookingNotification(completedBooking);
    const loyaltyNotif = this.createLoyaltyNotification(
      completedBooking.pointsEarned,
      loyaltyContext?.loyaltyProfile?.currentTier
    );

    // Add notifications
    if (notificationContext?.addNotification) {
      notificationContext.addNotification(bookingNotif);
      notificationContext.addNotification(loyaltyNotif);
    }

    return {
      bookingConfirmed: true,
      bookingId: completedBooking.bookingId,
      pointsEarned: completedBooking.pointsEarned,
      notifications: [bookingNotif, loyaltyNotif],
    };
  }

  // Get personalized offers based on user profile
  static getPersonalizedOffers(userProfile, bookingHistory) {
    const offers = [];

    // Based on user's favorite genres
    if (userProfile?.preferences?.favoriteGenres) {
      offers.push({
        id: 'offer_genre',
        name: 'Genre Favorite',
        description: `${userProfile.preferences.favoriteGenres[0]} Movies Special`,
        discount: 20,
        applicableGenres: userProfile.preferences.favoriteGenres,
      });
    }

    // Based on loyalty tier
    if (userProfile?.loyaltyTier === 'Gold') {
      offers.push({
        id: 'offer_gold',
        name: 'Gold Member Exclusive',
        description: 'Extra 10% off on all bookings',
        discount: 10,
        loyaltyTierRequired: 'Gold',
      });
    }

    if (userProfile?.loyaltyTier === 'Platinum') {
      offers.push({
        id: 'offer_platinum',
        name: 'Platinum Member Elite',
        description: 'Extra 15% off on all bookings',
        discount: 15,
        loyaltyTierRequired: 'Platinum',
      });
    }

    // Based on booking frequency
    if (bookingHistory?.length > 5) {
      offers.push({
        id: 'offer_frequent',
        name: 'Frequent Booker',
        description: '₹100 off on next booking',
        discount: 100,
        minBookings: 5,
      });
    }

    return offers;
  }

  // Sync user profile to recommendations
  static updateRecommendationsWithProfile(userProfile, recommendationEngine) {
    if (recommendationEngine) {
      // Recommendations will automatically use the updated user profile
      return true;
    }
    return false;
  }

  // Handle review to recommendation feedback
  static processReviewAsRecommendationFeedback(review, eventId, recommendationEngine) {
    // Use review rating as implicit feedback for recommendations
    return {
      eventId,
      userRating: review.rating,
      helpful: review.rating >= 4,
      genre: review.genre,
      timestamp: Date.now(),
    };
  }

  // Get next recommended action for user
  static getNextAction(userProfile, bookingHistory, wishlist) {
    if (!bookingHistory || bookingHistory.length === 0) {
      return {
        action: 'explore',
        title: 'Explore Events',
        description: 'Discover trending movies and events near you',
        cta: 'Browse Now',
      };
    }

    if (!userProfile?.preferences?.favoriteGenres) {
      return {
        action: 'complete_profile',
        title: 'Complete Your Profile',
        description: 'Add your preferences for better recommendations',
        cta: 'Go to Profile',
      };
    }

    if (wishlist?.length === 0) {
      return {
        action: 'add_wishlist',
        title: 'Build Your Wishlist',
        description: 'Save events you want to watch',
        cta: 'Add to Wishlist',
      };
    }

    return {
      action: 'rebook',
      title: 'Your Next Booking',
      description: 'Similar events based on your preferences',
      cta: 'Book Now',
    };
  }
}

export default IntegrationService;
