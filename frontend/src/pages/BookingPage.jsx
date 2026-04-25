import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSeatSelection } from '../context/SeatSelectionContext';
import { usePricing } from '../context/PricingContext';
import { useOffer } from '../context/OfferContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { useNotification } from '../context/NotificationContext';
import { ThemeContext } from '../context/ThemeContext';
import BookingService from '../services/BookingService';
import AuthService from '../services/AuthService';
import IntegrationService from '../utils/integrationService';
import './BookingPage.css';

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const { selectedSeats, selectSeat, deselectSeat, clearSeats } = useSeatSelection();
  const { calculatePrice, getPricingBreakdown } = usePricing();
  const { appliedOffer } = useOffer();
  const loyalty = useLoyalty();
  const notification = useNotification();
  const { isDark } = useContext(ThemeContext);

  const [selectedShowtime, setSelectedShowtime] = useState('14:30');
  const [selectedTheater, setSelectedTheater] = useState('pvr-downtown');
  const [bookingStep, setBookingStep] = useState('seating'); // seating, payment, confirmation
  const [bookingData, setBookingData] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get show ID from URL params
  const showId = searchParams.get('showId') || 1;

  useEffect(() => {
    // Track user journey
    IntegrationService.trackJourney(
      { id: 'booking_page', title: 'Booking Page' },
      'booking_started'
    );

    // Load show details from API
    loadShowDetails();
  }, [showId]);

  const loadShowDetails = async () => {
    try {
      setLoading(true);
      const details = await BookingService.getShowDetails(showId);
      setShowDetails(details);

      // Get available seats for the show
      const seatsData = await BookingService.getAvailableSeats(showId);
      setAvailableSeats(seatsData?.availableSeats || []);
    } catch (err) {
      console.error('Failed to load show details:', err);
      // Use mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const columns = 15;

  // Mock seat data
  const bookedSeats = ['A5', 'A6', 'B10', 'C3', 'C4', 'D7'];
  const seatPrice = 250;

  const showtimes = [
    { time: '10:30', available: true },
    { time: '14:30', available: true },
    { time: '18:00', available: true },
    { time: '21:30', available: false },
  ];

  const theaters = [
    { id: 'pvr-downtown', name: 'PVR Cinemas Downtown', city: 'Downtown', price: 250 },
    { id: 'inox-leisure', name: 'INOX Leisure', city: 'Sector 10', price: 280 },
    { id: 'cinepolis', name: 'Cinepolis Grand', city: 'North', price: 300 },
  ];

  const currentTheater = theaters.find((t) => t.id === selectedTheater);
  const totalPrice = selectedSeats.length * (currentTheater?.price || seatPrice);
  const discountAmount = appliedOffer ? Math.floor(totalPrice * (appliedOffer.discount / 100)) : 0;
  const finalPrice = totalPrice - discountAmount;

  const isSeatBooked = (seat) => bookedSeats.includes(seat);
  const isSeatSelected = (seat) => selectedSeats.includes(seat);

  const handleSeatClick = (seat) => {
    if (isSeatBooked(seat)) return;
    if (isSeatSelected(seat)) {
      deselectSeat(seat);
    } else {
      selectSeat(seat);
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    setBookingStep('payment');
  };

  const handleConfirmBooking = async () => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      alert('Please log in to complete your booking');
      window.location.href = '/login';
      return;
    }

    const completedBookingData = {
      eventTitle: showDetails?.title || 'Inception',
      eventId: showId,
      theater: currentTheater?.name,
      showtime: selectedShowtime,
      seats: selectedSeats,
      totalPrice: finalPrice,
      date: new Date().toISOString(),
      loyaltyTier: loyalty?.loyaltyProfile?.currentTier || 'Silver',
      showId: showId,
      userId: user.id,
    };

    try {
      setLoading(true);

      // Call BookingService to book the ticket
      const ticket = await BookingService.bookTicket(
        showId,
        selectedSeats,
        user.id
      );

      console.log('Booking successful:', ticket);
      setBookingData(completedBookingData);
      setBookingStep('confirmation');

      // Complete booking with full integration
      setTimeout(() => {
        const result = IntegrationService.completeBookingAndNotify(
          completedBookingData,
          loyalty,
          null, // bookingHistoryContext would go here
          notification
        );

        // Track journey completion
        IntegrationService.trackJourney(
          { id: completedBookingData.eventId, title: completedBookingData.eventTitle },
          'booking_completed'
        );
      }, 500);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed: ' + (err.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  if (bookingStep === 'confirmation') {
    return (
      <div className="booking-page">
        <div className="confirmation-container">
          <div className="confirmation-icon">✅</div>
          <h1>Booking Confirmed!</h1>
          <p className="confirmation-message">
            Your tickets have been booked successfully.
          </p>

          <div className="booking-details-card">
            <div className="details-row">
              <span>Event:</span>
              <span>Inception</span>
            </div>
            <div className="details-row">
              <span>Theater:</span>
              <span>{currentTheater?.name}</span>
            </div>
            <div className="details-row">
              <span>Date & Time:</span>
              <span>Tomorrow, {selectedShowtime}</span>
            </div>
            <div className="details-row">
              <span>Seats:</span>
              <span>{selectedSeats.join(', ')}</span>
            </div>
            <div className="details-row amount">
              <span>Total Amount:</span>
              <span>₹{finalPrice}</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <button className="btn-download-ticket">📥 Download Ticket</button>
            <button className="btn-share">📤 Share with Friends</button>
            <button className="btn-back-home" onClick={() => window.location.href = '/'}>
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`booking-page ${isDark ? '' : 'light'}`}>
      <div className="booking-container">
        {/* Header */}
        <div className="booking-header">
          <h1>Book Your Seats</h1>
          <p>Inception • Tomorrow</p>
        </div>

        <div className="booking-content">
          {/* Main Booking Area */}
          <div className="booking-main">
            {bookingStep === 'seating' && (
              <>
                {/* Theater Selection */}
                <section className="section-theater-selection">
                  <h3>Select Theater</h3>
                  <div className="theater-options">
                    {theaters.map((theater) => (
                      <div
                        key={theater.id}
                        className={`theater-option ${selectedTheater === theater.id ? 'selected' : ''}`}
                        onClick={() => setSelectedTheater(theater.id)}
                      >
                        <input
                          type="radio"
                          name="theater"
                          value={theater.id}
                          checked={selectedTheater === theater.id}
                          onChange={() => setSelectedTheater(theater.id)}
                        />
                        <div className="theater-info">
                          <span className="theater-name">{theater.name}</span>
                          <span className="theater-city">{theater.city}</span>
                        </div>
                        <span className="theater-price">₹{theater.price}/seat</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Showtime Selection */}
                <section className="section-showtime-selection">
                  <h3>Select Showtime</h3>
                  <div className="showtime-options">
                    {showtimes.map((showtime) => (
                      <button
                        key={showtime.time}
                        className={`showtime-btn ${selectedShowtime === showtime.time ? 'selected' : ''} ${!showtime.available ? 'disabled' : ''}`}
                        onClick={() => showtime.available && setSelectedShowtime(showtime.time)}
                        disabled={!showtime.available}
                      >
                        {showtime.time}
                        {!showtime.available && <span className="sold-out">Sold Out</span>}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Seating Section */}
                <section className="section-seating">
                  <h3>Select Seats</h3>

                  <div className="seating-info">
                    <div className="legend-item">
                      <div className="legend-seat available" />
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-seat booked" />
                      <span>Booked</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-seat selected" />
                      <span>Selected</span>
                    </div>
                  </div>

                  <div className="screen-display">🎬 SCREEN 🎬</div>

                  <div className="seating-grid">
                    {rows.map((row) => (
                      <div key={row} className="seating-row">
                        <span className="row-label">{row}</span>
                        <div className="seats-container">
                          {Array.from({ length: columns }).map((_, idx) => {
                            const seatNumber = idx + 1;
                            const seatId = `${row}${seatNumber}`;
                            const booked = isSeatBooked(seatId);
                            const selected = isSeatSelected(seatId);

                            return (
                              <button
                                key={seatId}
                                className={`seat ${booked ? 'booked' : ''} ${selected ? 'selected' : ''}`}
                                onClick={() => handleSeatClick(seatId)}
                                disabled={booked}
                                title={`Seat ${seatId}`}
                              >
                                {seatNumber}
                              </button>
                            );
                          })}
                        </div>
                        <span className="row-label">{row}</span>
                      </div>
                    ))}
                  </div>

                  {selectedSeats.length > 0 && (
                    <div className="selected-seats-display">
                      <strong>Selected Seats:</strong> {selectedSeats.join(', ')}
                      <button className="clear-seats-btn" onClick={clearSeats}>
                        Clear
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}

            {bookingStep === 'payment' && (
              <section className="section-payment">
                <h3>Payment & Confirmation</h3>

                <div className="payment-summary">
                  <div className="summary-item">
                    <span>Seat Price</span>
                    <span>₹{seatPrice} × {selectedSeats.length}</span>
                    <span>₹{totalPrice}</span>
                  </div>

                  {appliedOffer && (
                    <div className="summary-item discount">
                      <span>Discount ({appliedOffer.name})</span>
                      <span>-{appliedOffer.discount}%</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="summary-item total">
                    <span>Total Amount</span>
                    <span></span>
                    <span>₹{finalPrice}</span>
                  </div>
                </div>

                <div className="payment-methods">
                  <h4>Select Payment Method</h4>
                  <div className="methods-grid">
                    <button className="payment-method">💳 Credit Card</button>
                    <button className="payment-method">💳 Debit Card</button>
                    <button className="payment-method">📱 UPI</button>
                    <button className="payment-method">🏦 Net Banking</button>
                    <button className="payment-method">🪙 Wallet</button>
                    <button className="payment-method">📊 EMI</button>
                  </div>
                </div>

                <div className="payment-actions">
                  <button className="btn-secondary" onClick={() => setBookingStep('seating')}>
                    ← Back to Seating
                  </button>
                  <button className="btn-primary" onClick={handleConfirmBooking}>
                    Confirm Booking →
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="booking-sidebar">
            <div className="sidebar-card price-card">
              <h4>Price Summary</h4>

              <div className="price-breakdown">
                <div className="breakdown-item">
                  <span>Seat Count</span>
                  <span>{selectedSeats.length}</span>
                </div>
                <div className="breakdown-item">
                  <span>Unit Price</span>
                  <span>₹{currentTheater?.price || seatPrice}</span>
                </div>
                <div className="breakdown-item subtotal">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>

                {appliedOffer && (
                  <div className="breakdown-item discount">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="breakdown-item total">
                  <span>Total</span>
                  <span>₹{finalPrice}</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card details-card">
              <h4>Booking Details</h4>
              <div className="detail-row">
                <span>Event</span>
                <span>Inception</span>
              </div>
              <div className="detail-row">
                <span>Theater</span>
                <span>{currentTheater?.name}</span>
              </div>
              <div className="detail-row">
                <span>Showtime</span>
                <span>{selectedShowtime}</span>
              </div>
              <div className="detail-row">
                <span>Date</span>
                <span>Tomorrow</span>
              </div>
            </div>

            {bookingStep === 'seating' && (
              <button className="btn-proceed" onClick={handleProceedToPayment} disabled={selectedSeats.length === 0}>
                Proceed to Payment →
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
