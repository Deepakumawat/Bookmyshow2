/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

const API_CONFIG = {
  // Backend API base URL
  BASE_URL: 'http://localhost:8080/api',

  // Endpoints
  ENDPOINTS: {
    // User/Auth
    SIGNUP: '/users/signup',
    LOGIN: '/users/login',
    GET_USER: (userId) => `/users/${userId}`,
    UPDATE_USER: (userId) => `/users/${userId}`,

    // Shows
    GET_ALL_SHOWS: '/shows',
    GET_SHOW: (showId) => `/shows/${showId}`,
    CREATE_SHOW: '/shows',
    UPDATE_SHOW: (showId) => `/shows/${showId}`,
    DELETE_SHOW: (showId) => `/shows/${showId}`,

    // Tickets/Bookings
    BOOK_TICKET: '/tickets/book',
    GET_TICKET: (ticketId) => `/tickets/${ticketId}`,
    GET_SHOW_TICKETS: (showId) => `/tickets/show/${showId}`,
    CANCEL_TICKET: (ticketId) => `/tickets/${ticketId}`,

    // Theatres
    GET_ALL_THEATRES: '/theatres',
    GET_THEATRE: (theatreId) => `/theatres/${theatreId}`,
    GET_THEATRES_BY_CITY: (cityId) => `/theatres/city/${cityId}`,
    CREATE_THEATRE: '/theatres',
    UPDATE_THEATRE: (theatreId) => `/theatres/${theatreId}`,
    DELETE_THEATRE: (theatreId) => `/theatres/${theatreId}`,
  },

  // Timeout (in milliseconds)
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // milliseconds
  },

  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    BOOKINGS: 'bookings',
    LAST_SEARCH: 'lastSearch',
  },
};

export default API_CONFIG;
