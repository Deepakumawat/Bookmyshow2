/**
 * Centralized API Client for BookMyShow Frontend
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = `${import.meta.env.VITE_API_BASE || ''}/api`;

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.token;
  }

  /**
   * Clear authentication
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Build headers with authentication
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make HTTP request
   */
  async request(method, endpoint, data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method,
      headers: this.getHeaders(),
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      // Handle unauthorized
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
        throw new Error('Unauthorized - please login');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint) {
    return this.request('GET', endpoint);
  }

  /**
   * POST request
   */
  post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }

  /**
   * PUT request
   */
  put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  }

  /**
   * DELETE request
   */
  delete(endpoint) {
    return this.request('DELETE', endpoint);
  }
}

export default new APIClient();
