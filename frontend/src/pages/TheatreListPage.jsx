import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import TheatreService from '../services/TheatreService';
import './TheatreListPage.css';

function TheatreListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark } = useContext(ThemeContext);

  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'Mumbai');
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Jaipur', 'Chennai', 'Kolkata'];

  useEffect(() => {
    if (selectedCity) {
      loadTheatres();
    }
  }, [selectedCity]);

  const loadTheatres = async () => {
    try {
      setLoading(true);
      setError('');
      const allTheatres = await TheatreService.getAllTheatres();
      const filteredTheatres = allTheatres.filter(t => t.city === selectedCity);
      setTheatres(filteredTheatres.length > 0 ? filteredTheatres : generateMockTheatres(selectedCity));
    } catch (err) {
      console.error('Failed to load theatres:', err);
      setTheatres(generateMockTheatres(selectedCity));
    } finally {
      setLoading(false);
    }
  };

  const generateMockTheatres = (city) => {
    const mockData = {
      'Mumbai': [
        { id: 1, name: 'PVR Cinemas Inox', address: 'Lower Parel, Mumbai', city: 'Mumbai', rating: 4.5, screens: [{}, {}, {}], amenities: ['WiFi', 'Parking', 'Food Court'] },
        { id: 2, name: 'INOX Leisure', address: 'Sector 10, Mumbai', city: 'Mumbai', rating: 4.3, screens: [{}, {}], amenities: ['Parking', 'Food Court'] },
        { id: 3, name: 'Cinepolis Grand', address: 'North Mumbai', city: 'Mumbai', rating: 4.6, screens: [{}, {}, {}, {}], amenities: ['WiFi', 'Wheelchair Access'] },
      ],
      'Delhi': [
        { id: 4, name: 'PVR Cinemas Delhi', address: 'Connaught Place', city: 'Delhi', rating: 4.4, screens: [{}, {}, {}], amenities: ['WiFi', 'Parking'] },
      ],
      'Bangalore': [
        { id: 5, name: 'INOX Bangalore', address: 'Koramangala', city: 'Bangalore', rating: 4.5, screens: [{}, {}, {}], amenities: ['WiFi', 'Food Court'] },
      ],
    };
    return mockData[city] || [];
  };

  const handleTheatreSelect = (theatreId) => {
    navigate(`/booking?theatreId=${theatreId}&date=${selectedDate}`);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className={`theatre-list-page ${isDark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="theatre-page-header">
        <div className="header-content">
          <button className="btn-back" onClick={() => navigate('/')}>← Back</button>
          <div>
            <h1>Select Theatre</h1>
            <p>Choose your preferred cinema</p>
          </div>
        </div>
      </div>

      {/* City Selection */}
      <div className="theatre-container">
        <div className="filters-section">
          <h3>City</h3>
          <div className="city-selector">
            {cities.map(city => (
              <button
                key={city}
                className={`city-button ${selectedCity === city ? 'active' : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                📍 {city}
              </button>
            ))}
          </div>

          <h3 style={{ marginTop: '24px' }}>Date</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="theatres-list-section">
          <div className="results-header">
            <h2>{theatres.length} Theatres in {selectedCity}</h2>
            <p className="result-subtitle">Showing cinemas for {formatDate(selectedDate)}</p>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading theatres...</p>
            </div>
          )}

          {error && <div className="error-message">⚠️ {error}</div>}

          {!loading && theatres.length === 0 && (
            <div className="empty-state">
              <p>No theatres found</p>
            </div>
          )}

          {!loading && theatres.length > 0 && (
            <div className="theatres-list">
              {theatres.map(theatre => (
                <div key={theatre.id} className="theatre-item">
                  <div className="theatre-main-info">
                    <h4 className="theatre-name">{theatre.name}</h4>
                    <p className="theatre-address">📍 {theatre.address}</p>
                    <div className="theatre-specs">
                      <span className="spec-item">🎬 {theatre.screens?.length || 2} Screens</span>
                      <span className="spec-item">⭐ {theatre.rating || 4.5}</span>
                    </div>
                  </div>

                  <div className="theatre-amenities">
                    {theatre.amenities && theatre.amenities.slice(0, 2).map((amenity, idx) => (
                      <span key={idx} className="amenity-chip">
                        {amenity === 'WiFi' && '📶'} {amenity === 'Parking' && '🅿️'} {amenity === 'Food Court' && '🍿'}
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <button
                    className="btn-view-shows"
                    onClick={() => handleTheatreSelect(theatre.id)}
                  >
                    View Shows →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TheatreListPage;
