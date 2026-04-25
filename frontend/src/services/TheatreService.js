/**
 * Theatre Service
 * Handles theatre information and location management
 */

import APIClient from './APIClient';

class TheatreService {
  /**
   * Get all theatres
   */
  async getAllTheatres() {
    try {
      const response = await APIClient.get('/theatres');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Get theatres error:', error);
      throw error;
    }
  }

  /**
   * Get theatre by ID
   */
  async getTheatreById(theatreId) {
    try {
      const response = await APIClient.get(`/theatres/${theatreId}`);
      return response;
    } catch (error) {
      console.error('Get theatre error:', error);
      throw error;
    }
  }

  /**
   * Get theatres by city
   */
  async getTheatresByCity(cityId) {
    try {
      const response = await APIClient.get(`/theatres/city/${cityId}`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Get theatres by city error:', error);
      throw error;
    }
  }

  /**
   * Create a new theatre (admin only)
   */
  async createTheatre(theatreData) {
    try {
      const response = await APIClient.post('/theatres', theatreData);
      return response;
    } catch (error) {
      console.error('Create theatre error:', error);
      throw error;
    }
  }

  /**
   * Update theatre (admin only)
   */
  async updateTheatre(theatreId, theatreData) {
    try {
      const response = await APIClient.put(`/theatres/${theatreId}`, theatreData);
      return response;
    } catch (error) {
      console.error('Update theatre error:', error);
      throw error;
    }
  }

  /**
   * Delete theatre (admin only)
   */
  async deleteTheatre(theatreId) {
    try {
      const response = await APIClient.delete(`/theatres/${theatreId}`);
      return response;
    } catch (error) {
      console.error('Delete theatre error:', error);
      throw error;
    }
  }

  /**
   * Get theatre amenities
   */
  getAmenities() {
    return [
      { name: 'WiFi', icon: '📶' },
      { name: 'Parking', icon: '🅿️' },
      { name: 'Food Court', icon: '🍿' },
      { name: 'Wheelchair Access', icon: '♿' },
      { name: 'IMAX Screens', icon: '🎬' },
      { name: 'Recliner Seats', icon: '🪑' },
    ];
  }

  /**
   * Get theatre rating
   */
  getTheatreRating(theatreId) {
    // Mock rating - in production, this would come from the backend
    return {
      rating: 4.5,
      reviews: 234,
      verified: true,
    };
  }
}

export default new TheatreService();
