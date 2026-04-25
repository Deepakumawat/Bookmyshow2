import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { EnhancedHeader } from '../components/layout/EnhancedHeader';
import DataService from '../services/DataService';
import MLDashboard from '../components/ml/MLDashboard';
import '../styles/EnhancedHomePage.css';

function EnhancedHomePage() {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [activeCategory, setActiveCategory] = useState('Movies');
  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load movies
      const moviesData = await DataService.getMovies();
      setMovies(moviesData);

      // Load cities
      const citiesData = DataService.getAvailableCities();
      setCities(citiesData);

      // Load offers
      const offersData = await DataService.getOffers();
      setOffers(offersData.slice(0, 4));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = DataService.getCategories();

  return (
    <div className={`enhanced-home ${isDark ? 'dark' : 'light'}`}>
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Your Entertainment Awaits</h1>
          <p className="hero-subtitle">Book movies, events, plays & more in seconds</p>

          {/* City Selector */}
          <div className="city-selector-container">
            <span className="city-label">📍 Select Your City:</span>
            <div className="city-grid">
              {cities.map(city => (
                <button
                  key={city}
                  className={`city-chip ${selectedCity === city ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <button className="hero-cta" onClick={() => navigate('/theatres')}>
            Explore Shows in {selectedCity} →
          </button>
        </div>
      </section>

      {/* Quick Navigation Features */}
      <section className="quick-features">
        <div className="features-container">
          <div className="feature-card" onClick={() => navigate('/theatres')}>
            <span className="feature-icon">🎬</span>
            <h3>Find Movies</h3>
            <p>Latest releases & showtimes</p>
          </div>
          <div className="feature-card" onClick={() => navigate('/loyalty')}>
            <span className="feature-icon">⭐</span>
            <h3>Loyalty Rewards</h3>
            <p>Earn points on every booking</p>
          </div>
          <div className="feature-card" onClick={() => navigate('/offers')}>
            <span className="feature-icon">🎉</span>
            <h3>Special Offers</h3>
            <p>Get up to 50% discount</p>
          </div>
          <div className="feature-card" onClick={() => navigate('/bookings')}>
            <span className="feature-icon">🎫</span>
            <h3>My Bookings</h3>
            <p>View & manage your tickets</p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="category-section">
        <div className="section-header">
          <h2>What's On?</h2>
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                <span className="tab-icon">{cat.icon}</span>
                <span className="tab-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Now Showing */}
      <section className="now-showing-section">
        <div className="section-container">
          <h2 className="section-title">Now Showing in {selectedCity}</h2>

          {loading ? (
            <div className="loading-container">
              <p>Loading movies...</p>
            </div>
          ) : (
            <div className="movies-grid">
              {movies.slice(0, 8).map(movie => (
                <div
                  key={movie.id}
                  className="movie-card"
                  onClick={() => navigate(`/event/${movie.id}`)}
                >
                  <div className="movie-poster">
                    <img
                      src={movie.poster || `https://via.placeholder.com/150x225?text=${movie.title}`}
                      alt={movie.title}
                    />
                    <div className="movie-overlay">
                      <button className="book-btn">Book Now</button>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-genre">{movie.genre}</p>
                    <div className="movie-rating">
                      <span className="rating-value">
                        ⭐ {movie.imdbRating || '8.5'}
                      </span>
                      <span className="rating-language">
                        {movie.languages?.[0] || 'Hindi'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Offers */}
      {offers.length > 0 && (
        <section className="offers-section">
          <div className="section-container">
            <div className="offers-header">
              <h2 className="section-title">🎉 Special Offers</h2>
              <button className="view-all-link" onClick={() => navigate('/offers')}>
                View All Offers →
              </button>
            </div>

            <div className="offers-grid">
              {offers.map(offer => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-badge">
                    {offer.discount}
                    {offer.type === 'percentage' ? '%' : '₹'} OFF
                  </div>
                  <div className="offer-content">
                    <h3 className="offer-title">{offer.title}</h3>
                    <p className="offer-description">{offer.description}</p>
                    <div className="offer-footer">
                      <span className="offer-code">{offer.code}</span>
                      <button className="offer-apply-btn">Apply →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* User Quick Links (if logged in) */}
      {user?.isLoggedIn && (
        <section className="user-dashboard-section">
          <div className="section-container">
            <h2 className="section-title">Welcome back, {user.name}!</h2>
            <div className="dashboard-cards">
              <div className="dashboard-card" onClick={() => navigate('/loyalty')}>
                <span className="card-icon">⭐</span>
                <h3>Your Loyalty Points</h3>
                <p className="card-value">2,350 Points</p>
                <p className="card-subtitle">Gold Member</p>
              </div>
              <div className="dashboard-card" onClick={() => navigate('/bookings')}>
                <span className="card-icon">🎫</span>
                <h3>Upcoming Bookings</h3>
                <p className="card-value">2 Bookings</p>
                <p className="card-subtitle">Next: Today 7:30 PM</p>
              </div>
              <div className="dashboard-card" onClick={() => navigate('/settings/payments')}>
                <span className="card-icon">💳</span>
                <h3>Payment Methods</h3>
                <p className="card-value">4 Methods</p>
                <p className="card-subtitle">Manage cards & wallets</p>
              </div>
              <div className="dashboard-card" onClick={() => navigate('/profile')}>
                <span className="card-icon">👤</span>
                <h3>Your Profile</h3>
                <p className="card-value">{user.email}</p>
                <p className="card-subtitle">Edit profile & settings</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Select City & Category</h3>
              <p>Choose your location and what you want to watch</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Pick Theatre & Show</h3>
              <p>Select your preferred theatre and showtime</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Choose Seats</h3>
              <p>Pick your ideal seats with dynamic pricing</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Payment & Confirm</h3>
              <p>Complete payment and get instant confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* ML Intelligence Dashboard */}
      <section style={{ padding: '0 24px 24px' }}>
        <MLDashboard />
      </section>

      {/* Footer */}
      <footer className="enhanced-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About BookMyShow</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#help">Help Center</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Policies</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#cancellation">Cancellation Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#facebook">f</a>
              <a href="#twitter">𝕏</a>
              <a href="#instagram">📷</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 BookMyShow Advanced. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default EnhancedHomePage;
