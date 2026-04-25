/**
 * Booking Service
 * Handles ticket booking, booking history, and seat management
 */

import APIClient from './APIClient';

class BookingService {
  /**
   * Book a ticket
   */
  async bookTicket(showId, seatIds, userId) {
    try {
      const response = await APIClient.post('/tickets/book', {
        showId,
        seatIds,
        userId,
      });

      if (response.success && response.ticket) {
        return response.ticket;
      } else {
        throw new Error(response.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      throw error;
    }
  }

  /**
   * Get ticket details
   */
  async getTicket(ticketId) {
    try {
      const response = await APIClient.get(`/tickets/${ticketId}`);

      if (response.success && response.ticket) {
        return response.ticket;
      } else {
        throw new Error(response.message || 'Failed to fetch ticket');
      }
    } catch (error) {
      console.error('Get ticket error:', error);
      throw error;
    }
  }

  /**
   * Get all tickets for a show
   */
  async getShowTickets(showId) {
    try {
      const response = await APIClient.get(`/tickets/show/${showId}`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Get show tickets error:', error);
      throw error;
    }
  }

  /**
   * Cancel a ticket
   */
  async cancelTicket(ticketId) {
    try {
      const response = await APIClient.delete(`/tickets/${ticketId}`);
      return response;
    } catch (error) {
      console.error('Cancel ticket error:', error);
      throw error;
    }
  }

  /**
   * Get available shows
   */
  async getShows() {
    try {
      const response = await APIClient.get('/shows');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Get shows error:', error);
      throw error;
    }
  }

  /**
   * Get show details
   */
  async getShowDetails(showId) {
    try {
      const response = await APIClient.get(`/shows/${showId}`);
      return response;
    } catch (error) {
      console.error('Get show details error:', error);
      throw error;
    }
  }

  /**
   * Get available seats for a show
   */
  async getAvailableSeats(showId) {
    try {
      const tickets = await this.getShowTickets(showId);
      // Extract booked seat IDs from tickets
      const bookedSeats = new Set();
      tickets.forEach(ticket => {
        if (ticket.seats && Array.isArray(ticket.seats)) {
          ticket.seats.forEach(seat => bookedSeats.add(seat.id));
        }
      });
      return {
        bookedSeats: Array.from(bookedSeats),
        availableSeats: this.getAllSeatIds().filter(id => !bookedSeats.has(id))
      };
    } catch (error) {
      console.error('Get available seats error:', error);
      throw error;
    }
  }

  /**
   * Get all seat IDs (for a theater with 10 rows x 15 columns)
   */
  getAllSeatIds() {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= 15; j++) {
        seats.push(`${rows[i]}${j}`);
      }
    }
    return seats;
  }
}

export default new BookingService();
