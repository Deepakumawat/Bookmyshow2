import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import BookingService from '../services/BookingService';
import TheatreService from '../services/TheatreService';
import './ShowListPage.css';

function ShowListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark } = useContext(ThemeContext);

  const [shows, setShows] = useState([]);
  const [theatreInfo, setTheatreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const theatreId = searchParams.get('theatreId') || '';
  const selectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (theatreId) {
      loadTheatreAndShows();
    }
  }, [theatreId, selectedDate]);

  const loadTheatreAndShows = async () => {
    try {
      setLoading(true);
      setError('');

      // Get theatre info
      const theatre = await TheatreService.getTheatreById(theatreId);
      setTheatreInfo(theatre);

      // Get all shows and filter by theatre
      const allShows = await BookingService.getShows();
      const theatreShows = allShows.filter(show => {
        const showDate = new Date(show.startTime).toISOString().split('T')[0];
        return showDate === selectedDate;
      });

      setShows(theatreShows);
    } catch (err) {
      console.error('Failed to load shows:', err);
      setError('Failed to load shows. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (showId) => {
    navigate(`/booking?showId=${showId}&theatreId=${theatreId}&date=${selectedDate}`);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`show-list-page ${isDark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="show-header">
        <button className="btn-back" onClick={() => navigate('/theatres')}>
          ← Back
        </button>
        <div className="header-content">
          <h1>🎬 Select Show</h1>
          {theatreInfo && (
            <div className="theatre-info-header">
              <h3>{theatreInfo.name}</h3>
              <p>{formatDate(selectedDate)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Shows Container */}
      <div className="shows-container">
        {loading && <div className="loading-message">Loading shows...</div>}
        {error && <div className="error-message">⚠️ {error}</div>}
        {!loading && shows.length === 0 && (
          <div className="empty-message">
            No shows available for this theatre on {formatDate(selectedDate)}
          </div>
        )}

        {!loading && shows.length > 0 && (
          <div className="shows-grid">
            {shows.map(show => (
              <div key={show.id} className="show-card">
                <div className="show-time-badge">
                  🎬 {formatTime(show.startTime)}
                </div>

                <div className="show-details">
                  <h4>Show {show.id}</h4>
                  <div className="show-format">
                    <span className="format-tag">2D</span>
                    <span className="format-tag">Dolby</span>
                  </div>
                </div>

                <div className="show-info">
                  <p className="show-duration">
                    ⏱️ {Math.round((new Date(show.endTime) - new Date(show.startTime)) / 60000)} mins
                  </p>
                  <p className="show-language">🗣️ Hindi</p>
                </div>

                <div className="show-pricing">
                  <div className="price-info">
                    <span className="price-label">From</span>
                    <span className="price-amount">₹250</span>
                  </div>
                </div>

                <button
                  className="btn-book-show"
                  onClick={() => handleBooking(show.id)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theatre Details Section */}
      {theatreInfo && !loading && (
        <div className="theatre-details-section">
          <h3>Theatre Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Address</span>
              <span className="detail-value">{theatreInfo.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">City</span>
              <span className="detail-value">{theatreInfo.city}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Screens</span>
              <span className="detail-value">{theatreInfo.screens?.length || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Rating</span>
              <span className="detail-value">⭐ {theatreInfo.rating || 4.5}</span>
            </div>
          </div>

          {theatreInfo.amenities && theatreInfo.amenities.length > 0 && (
            <div className="amenities-section">
              <h4>Amenities</h4>
              <div className="amenities-list">
                {theatreInfo.amenities.map((amenity, idx) => (
                  <span key={idx} className="amenity-badge">
                    {amenity === 'WiFi' && '📶'}
                    {amenity === 'Parking' && '🅿️'}
                    {amenity === 'Food Court' && '🍿'}
                    {amenity === 'Wheelchair Access' && '♿'}
                    {' '} {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShowListPage;
