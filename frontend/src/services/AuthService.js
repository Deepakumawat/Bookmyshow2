/**
 * Authentication Service
 * Handles user login, signup, and profile management
 */

import APIClient from './APIClient';

class AuthService {
  /**
   * Sign up a new user
   */
  async signup(name, email, password) {
    try {
      const response = await APIClient.post('/users/signup', {
        name,
        email,
        password,
      });

      // Handle backend response format
      const isSuccess = response.response?.status === 'SUCCESS' || response.success;

      if (isSuccess) {
        // Extract user data from response
        const userData = response.user || {
          name: response.name,
          email: response.email,
          id: response.id
        };

        // Store user data and token if available
        localStorage.setItem('user', JSON.stringify(userData));
        if (response.token) {
          APIClient.setToken(response.token);
        }
        return userData;
      } else {
        throw new Error(response.response?.message || response.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await APIClient.post('/users/login', {
        email,
        password,
      });

      // Handle backend response format
      const isSuccess = response.response?.status === 'SUCCESS' || response.success;

      if (isSuccess) {
        // Extract user data from response
        const userData = response.user || {
          name: response.name,
          email: response.email,
          id: response.id
        };

        // Store user data and token
        localStorage.setItem('user', JSON.stringify(userData));
        if (response.token) {
          APIClient.setToken(response.token);
        }
        return userData;
      } else {
        throw new Error(response.response?.message || response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    APIClient.clearToken();
    localStorage.removeItem('user');
  }

  /**
   * Get current logged-in user
   */
  getCurrentUser() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!APIClient.getToken() && !!this.getCurrentUser();
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    try {
      const response = await APIClient.get(`/users/${userId}`);
      if (response.success && response.user) {
        return response.user;
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, name, email) {
    try {
      const response = await APIClient.put(`/users/${userId}`, {
        name,
        email,
      });

      if (response.success && response.user) {
        // Update local user data
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
}

export default new AuthService();
