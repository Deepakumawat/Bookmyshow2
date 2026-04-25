# Phase 4: Frontend Component Integration

## Overview
This guide shows how to integrate API services into your existing React components.

---

## 1. HomePage Integration

### Current State
HomePage has mock movie data.

### Update Required
Replace mock data with real API calls.

### Implementation
**File**: `src/pages/HomePage.jsx`

```javascript
import { useEffect, useState } from 'react';
import BookingService from '../services/BookingService';
import AuthService from '../services/AuthService';

function HomePage() {
  const [banners, setBanners] = useState([]);
  const [nowShowing, setNowShowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    try {
      setLoading(true);
      const shows = await BookingService.getShows();
      
      // Use first 3 shows as banners
      setBanners(shows.slice(0, 3).map(show => ({
        id: show.id,
        title: `Show ${show.id}`,
        image: '🎬',
        rating: '8.5',
        genre: 'Movie'
      })));
      
      // Use all shows for "Now Showing"
      setNowShowing(shows);
    } catch (error) {
      console.error('Failed to load shows:', error);
      // Keep mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (id) => {
    navigate(`/event/${id}`);
  };

  if (loading) return <div>Loading shows...</div>;

  return (
    <div className={`homepage ${isDark ? 'dark' : 'light'}`}>
      {/* Header remains the same */}
      
      {/* Hero Banner with real data */}
      <section className="hero-section">
        <div className="banner-slide">
          {currentBanner && (
            <>
              <div className="banner-image">{currentBanner.image}</div>
              <div className="banner-content">
                <h1>{currentBanner.title}</h1>
                <button onClick={() => handleMovieClick(currentBanner.id)}>
                  🎫 Book Tickets
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Now Showing with real data */}
      <section className="now-showing">
        <h2>Now Showing</h2>
        <div className="movie-grid">
          {nowShowing.map(show => (
            <div key={show.id} className="movie-card">
              <h3>Show {show.id}</h3>
              <p>Start: {new Date(show.startTime).toLocaleString()}</p>
              <button onClick={() => handleMovieClick(show.id)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
```

---

## 2. LoginPage Integration

### Current State
LoginPage likely has mock sign-in.

### Update Required
Connect to AuthService for real authentication.

### Implementation
**File**: `src/pages/LoginPage.jsx` (Create if doesn't exist)

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './LoginPage.css'; // Use similar styling as other pages

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      const user = await AuthService.login(email, password);
      console.log('Login successful:', user);
      
      // Navigate to home
      navigate('/');
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className={`login-page ${isDark ? 'dark' : 'light'}`}>
      <div className="login-container">
        <h1>🎬 BookMyShow</h1>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account?{' '}
          <button onClick={handleSignup}>Sign up</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
```

---

## 3. SignupPage Integration

### Implementation
**File**: `src/pages/SignupPage.jsx` (Create if doesn't exist)

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const user = await AuthService.signup(
        formData.name,
        formData.email,
        formData.password
      );
      
      console.log('Signup successful:', user);
      // Navigate to home
      navigate('/');
    } catch (error) {
      setError(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create Account</h1>
        
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
```

---

## 4. BookingPage Integration

### Current State
Uses mock seat data.

### Update Required
Connect to BookingService for real booking.

### Implementation (Key Changes)
**File**: `src/pages/BookingPage.jsx`

```javascript
import { useState, useEffect } from 'react';
import BookingService from '../services/BookingService';
import AuthService from '../services/AuthService';
import SeatingMap from '../components/booking/SeatingMap';

function BookingPage() {
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');
  const [bookingStep, setBookingStep] = useState('seating');
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');

  // Get show ID from URL params or context
  const showId = new URLSearchParams(window.location.search).get('showId') || 1;

  useEffect(() => {
    loadShowDetails();
  }, [showId]);

  const loadShowDetails = async () => {
    try {
      setLoading(true);
      const showDetails = await BookingService.getShowDetails(showId);
      setShow(showDetails);

      // Get available seats
      const seats = await BookingService.getAvailableSeats(showId);
      setAvailableSeats(seats.availableSeats);
    } catch (error) {
      setError('Failed to load show details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    try {
      setLoading(true);
      const user = AuthService.getCurrentUser();
      
      const ticket = await BookingService.bookTicket(
        showId,
        selectedSeats,
        user.id
      );

      console.log('Booking successful:', ticket);
      setBookingStep('confirmation');
    } catch (error) {
      setError(error.message || 'Booking failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="booking-page">
      {bookingStep === 'seating' && (
        <>
          <SeatingMap
            availableSeats={availableSeats}
            selectedSeats={selectedSeats}
            onSelectSeat={setSelectedSeats}
          />
          <button onClick={handleBooking} disabled={selectedSeats.length === 0}>
            Proceed to Payment
          </button>
        </>
      )}
      
      {bookingStep === 'confirmation' && (
        <div className="confirmation">✅ Booking confirmed!</div>
      )}
    </div>
  );
}

export default BookingPage;
```

---

## 5. UserProfilePage Integration

### Update Required
Load real user data from backend.

### Implementation (Key Changes)
**File**: `src/pages/UserProfilePage.jsx`

```javascript
import { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        setError('Not logged in');
        return;
      }

      const userProfile = await AuthService.getUserProfile(currentUser.id);
      setUser(userProfile);
      setFormData(userProfile);
    } catch (error) {
      setError('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = await AuthService.updateProfile(
        user.id,
        formData.name,
        formData.email
      );
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile-page">
      {user && (
        <>
          <h1>{user.name}</h1>
          <p>{user.email}</p>

          {isEditing ? (
            <>
              <input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <button onClick={handleUpdate}>Save</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default UserProfilePage;
```

---

## Integration Checklist

- [ ] Update HomePage to load shows from API
- [ ] Create LoginPage with AuthService
- [ ] Create SignupPage with AuthService
- [ ] Update BookingPage to use BookingService
- [ ] Update UserProfilePage to load from API
- [ ] Add loading states to all pages
- [ ] Add error handling to all pages
- [ ] Test all API calls
- [ ] Add logout functionality to Header
- [ ] Add authentication guards to protected routes

---

## Testing Each Integration

### 1. Test HomePage Shows
- Open homepage
- Verify shows load from backend
- Console should show API calls
- No mock data should appear

### 2. Test Authentication
- Sign up new user
- Verify in backend: `SELECT * FROM user;`
- Login with new credentials
- Token should be stored in localStorage

### 3. Test Booking
- Login first
- Go to booking page
- Select seats
- Click "Book"
- Verify in backend: `SELECT * FROM ticket;`

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot read property 'id' of null" | User not logged in - redirect to login |
| API returns 401 | Token expired - call logout and redirect to login |
| "Failed to load..." | Check network tab, verify backend is running |
| Duplicate requests | Use useEffect cleanup to prevent multiple calls |

---

**Status**: Ready for component integration!
