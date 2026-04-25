/**
 * API Service Layer
 * Handles all backend communication with fallback to mock data
 */

const API_BASE_URL = `${import.meta.env.VITE_API_BASE || ''}/api`;

class APIService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      this.headers['Authorization'] = `Bearer ${this.token}`;
    }
  }

  setToken(token) {
    this.token = token;
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          this.token = null;
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // User Authentication
  async login(email, password) {
    return this.makeRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData) {
    return this.makeRequest('/users/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile() {
    return this.makeRequest('/users/me');
  }

  async updateProfile(userData) {
    return this.makeRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Theatres
  async getTheatres(city = null) {
    const endpoint = city ? `/theatres?city=${city}` : '/theatres';
    return this.makeRequest(endpoint);
  }

  async getTheatreById(id) {
    return this.makeRequest(`/theatres/${id}`);
  }

  async getTheatresByCity(cityId) {
    return this.makeRequest(`/theatres/city/${cityId}`);
  }

  // Shows
  async getShows(theatreId = null, date = null) {
    let endpoint = '/shows';
    const params = [];
    if (theatreId) params.push(`theatre=${theatreId}`);
    if (date) params.push(`date=${date}`);
    if (params.length) endpoint += '?' + params.join('&');
    return this.makeRequest(endpoint);
  }

  async getShowById(id) {
    return this.makeRequest(`/shows/${id}`);
  }

  // Shows for a specific show
  async getShowSeats(showId) {
    return this.makeRequest(`/shows/${showId}/seats`);
  }

  // Bookings
  async getBookings() {
    return this.makeRequest('/bookings');
  }

  async getBookingById(id) {
    return this.makeRequest(`/bookings/${id}`);
  }

  async createBooking(bookingData) {
    return this.makeRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async cancelBooking(id) {
    return this.makeRequest(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Tickets
  async getTickets() {
    return this.makeRequest('/tickets');
  }

  async getTicketById(id) {
    return this.makeRequest(`/tickets/${id}`);
  }

  async bookTickets(ticketData) {
    return this.makeRequest('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  // Seats
  async getSeats(showId) {
    return this.makeRequest(`/shows/${showId}/seats`);
  }

  async reserveSeats(showId, seatIds) {
    return this.makeRequest(`/shows/${showId}/seats/reserve`, {
      method: 'POST',
      body: JSON.stringify({ seatIds }),
    });
  }

  async releaseSeats(showId, seatIds) {
    return this.makeRequest(`/shows/${showId}/seats/release`, {
      method: 'POST',
      body: JSON.stringify({ seatIds }),
    });
  }

  // Reviews
  async getTheatreReviews(theatreId) {
    return this.makeRequest(`/theatres/${theatreId}/reviews`);
  }

  async submitReview(theatreId, review) {
    return this.makeRequest(`/theatres/${theatreId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // Health Check
  async healthCheck() {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || ''}/actuator/health`, {
        method: 'GET',
      });
      return true;
    } catch {
      return false;
    }
  }
}

export default new APIService();
