// AI-Powered Recommendation Engine
// Generates personalized movie recommendations based on user preferences and history

export class RecommendationEngine {
  constructor(userProfile, bookingHistory, wishlist) {
    this.userProfile = userProfile;
    this.bookingHistory = bookingHistory;
    this.wishlist = wishlist;
  }

  /**
   * Get recommendations based on user's favorite genres
   */
  getGenreBasedRecommendations(allEvents, limit = 5) {
    const { preferences } = this.userProfile;
    const favoriteGenres = preferences.favoriteGenres || [];

    if (favoriteGenres.length === 0) return [];

    const scored = allEvents
      .filter((event) => !this.isAlreadyBooked(event.id))
      .map((event) => {
        const genreMatches = event.genres.filter((g) =>
          favoriteGenres.includes(g)
        ).length;
        const score = genreMatches * 10;
        return { ...event, score };
      })
      .filter((event) => event.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
  }

  /**
   * Get recommendations based on user's favorite languages
   */
  getLanguageBasedRecommendations(allEvents, limit = 5) {
    const { preferences } = this.userProfile;
    const favoriteLanguages = preferences.favoriteLanguages || [];

    if (favoriteLanguages.length === 0) return [];

    const scored = allEvents
      .filter((event) => !this.isAlreadyBooked(event.id))
      .map((event) => {
        const hasPreferredLanguage = favoriteLanguages.includes(event.language);
        return {
          ...event,
          score: hasPreferredLanguage ? 100 : 0,
        };
      })
      .filter((event) => event.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
  }

  /**
   * Get trending recommendations (similar to what user has booked)
   */
  getTrendingBasedRecommendations(allEvents, limit = 5) {
    const bookedGenres = this.getBookedGenres();

    const scored = allEvents
      .filter((event) => !this.isAlreadyBooked(event.id))
      .map((event) => {
        const trendingScore = event.rating * 10; // Use rating as trending indicator
        const genreRelevance = event.genres.some((g) => bookedGenres.includes(g)) ? 50 : 0;
        return {
          ...event,
          score: trendingScore + genreRelevance,
        };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
  }

  /**
   * Get personalized recommendations (combined algorithm)
   */
  getPersonalizedRecommendations(allEvents, limit = 8) {
    const genreRecommendations = this.getGenreBasedRecommendations(allEvents, limit);
    const languageRecommendations = this.getLanguageBasedRecommendations(allEvents, limit);
    const trendingRecommendations = this.getTrendingBasedRecommendations(allEvents, limit);

    const recommendedIds = new Set();
    const recommendations = [];

    // Combine recommendations with weighted approach
    const allRecommendations = [
      ...genreRecommendations.map((e) => ({ ...e, source: 'genre', weight: 3 })),
      ...languageRecommendations.map((e) => ({ ...e, source: 'language', weight: 2 })),
      ...trendingRecommendations.map((e) => ({ ...e, source: 'trending', weight: 1 })),
    ];

    // Remove duplicates and aggregate scores
    const uniqueRecommendations = {};
    allRecommendations.forEach((rec) => {
      if (!recommendedIds.has(rec.id)) {
        if (!uniqueRecommendations[rec.id]) {
          uniqueRecommendations[rec.id] = { ...rec, totalScore: 0, sources: [] };
        }
        uniqueRecommendations[rec.id].totalScore += rec.score * rec.weight;
        uniqueRecommendations[rec.id].sources.push(rec.source);
        recommendedIds.add(rec.id);
      }
    });

    return Object.values(uniqueRecommendations)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
  }

  /**
   * Get similar movies based on a specific movie
   */
  getSimilarMovies(eventId, allEvents, limit = 5) {
    const targetEvent = allEvents.find((e) => e.id === eventId);
    if (!targetEvent) return [];

    const scored = allEvents
      .filter((event) => event.id !== eventId && !this.isAlreadyBooked(event.id))
      .map((event) => {
        let score = 0;

        // Genre similarity (40%)
        const genreMatches = event.genres.filter((g) =>
          targetEvent.genres.includes(g)
        ).length;
        score += genreMatches * 40;

        // Language match (30%)
        if (event.language === targetEvent.language) score += 30;

        // Rating proximity (20%)
        const ratingDiff = Math.abs(event.rating - targetEvent.rating);
        score += Math.max(0, 20 - ratingDiff * 2);

        // Type match (10%)
        if (event.type === targetEvent.type) score += 10;

        return { ...event, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
  }

  /**
   * Get "Users who watched X also watched Y" recommendations
   */
  getCollaborativeRecommendations(eventId, allEvents, limit = 5) {
    // This would typically use collaborative filtering with other users' data
    // For now, we'll use a simple approach based on similar ratings
    const targetEvent = allEvents.find((e) => e.id === eventId);
    if (!targetEvent) return [];

    const scored = allEvents
      .filter((event) => event.id !== eventId && !this.isAlreadyBooked(event.id))
      .map((event) => {
        const ratingDiff = Math.abs(event.rating - targetEvent.rating);
        const score = Math.max(0, 100 - ratingDiff * 10);
        return { ...event, score };
      })
      .filter((event) => event.score > 50)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
  }

  /**
   * Helper: Check if user has already booked an event
   */
  isAlreadyBooked(eventId) {
    return this.bookingHistory.some((booking) => booking.eventId === eventId);
  }

  /**
   * Helper: Get genres from user's booking history
   */
  getBookedGenres() {
    const genres = new Set();
    this.bookingHistory.forEach((booking) => {
      if (booking.genres) {
        booking.genres.forEach((g) => genres.add(g));
      }
    });
    return Array.from(genres);
  }

  /**
   * Get recommendation explanation text
   */
  getRecommendationReason(event, sources = []) {
    if (sources.includes('genre')) {
      return `Based on your love for ${this.userProfile.preferences.favoriteGenres[0]}`;
    }
    if (sources.includes('language')) {
      return `Available in ${this.userProfile.preferences.favoriteLanguages[0]}`;
    }
    if (sources.includes('trending')) {
      return `Trending this week`;
    }
    return `Recommended for you`;
  }
}

/**
 * Create recommendation engine with user data
 */
export const createRecommendationEngine = (userProfile, bookingHistory = [], wishlist = []) => {
  return new RecommendationEngine(userProfile, bookingHistory, wishlist);
};

/**
 * Get recommendations from scratch
 */
export const getRecommendations = (
  userProfile,
  allEvents,
  type = 'personalized',
  limit = 8
) => {
  const engine = createRecommendationEngine(userProfile);

  switch (type) {
    case 'genre':
      return engine.getGenreBasedRecommendations(allEvents, limit);
    case 'language':
      return engine.getLanguageBasedRecommendations(allEvents, limit);
    case 'trending':
      return engine.getTrendingBasedRecommendations(allEvents, limit);
    case 'personalized':
    default:
      return engine.getPersonalizedRecommendations(allEvents, limit);
  }
};
