# BookMyShow - Frontend & Backend Integration Guide

## Overview
This guide covers the complete setup and integration of the BookMyShow frontend (React) with the Java Spring Boot backend.

---

## Part 1: Backend Setup

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Git

### Step 1: Clone Backend Repository
```bash
git clone https://github.com/Deepakumawat/Bookmyshow2.git
cd Bookmyshow2
```

### Step 2: Create MySQL Database
```bash
mysql -u root -p
CREATE DATABASE bookmyshow;
```

### Step 3: Configure Database (Already Done)
The `application.properties` file is pre-configured for:
- Database: `bookmyshow`
- Host: `localhost:3306`
- Default username: `root`
- Default password: (empty)

**Update credentials if needed in:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookmyshow?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
```

### Step 4: Build & Run Backend
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Backend will run on: http://localhost:8080
# API Base URL: http://localhost:8080/api
```

---

## Part 2: Frontend Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Step 1: Frontend is Already Configured
The frontend at `C:\BookMyShow_Advanced` has been updated with API services.

### Step 2: Update API Configuration (if needed)
Edit `src/config/apiConfig.js` to match your backend URL:
```javascript
BASE_URL: 'http://localhost:8080/api'
```

### Step 3: Install Dependencies
```bash
cd BookMyShow_Advanced
npm install
```

### Step 4: Run Frontend
```bash
npm run dev

# Frontend will run on: http://localhost:5182 (or next available port)
```

---

## Part 3: API Services Documentation

### Available Services

#### 1. AuthService (`src/services/AuthService.js`)
```javascript
// Signup
await AuthService.signup(name, email, password);

// Login
await AuthService.login(email, password);

// Logout
AuthService.logout();

// Get current user
const user = AuthService.getCurrentUser();

// Check authentication
if (AuthService.isAuthenticated()) { ... }

// Get user profile
await AuthService.getUserProfile(userId);

// Update profile
await AuthService.updateProfile(userId, name, email);
```

#### 2. BookingService (`src/services/BookingService.js`)
```javascript
// Book a ticket
await BookingService.bookTicket(showId, seatIds, userId);

// Get ticket details
await BookingService.getTicket(ticketId);

// Get available seats
await BookingService.getAvailableSeats(showId);

// Cancel booking
await BookingService.cancelTicket(ticketId);

// Get all shows
await BookingService.getShows();

// Get show details
await BookingService.getShowDetails(showId);
```

#### 3. TheatreService (`src/services/TheatreService.js`)
```javascript
// Get all theatres
await TheatreService.getAllTheatres();

// Get theatre by ID
await TheatreService.getTheatreById(theatreId);

// Get theatres by city
await TheatreService.getTheatresByCity(cityId);

// Create theatre (admin)
await TheatreService.createTheatre(theatreData);

// Update theatre (admin)
await TheatreService.updateTheatre(theatreId, theatreData);

// Delete theatre (admin)
await TheatreService.deleteTheatre(theatreId);

// Get amenities
TheatreService.getAmenities();
```

#### 4. APIClient (`src/services/APIClient.js`)
Low-level HTTP client used by all services:
```javascript
// GET request
await APIClient.get('/endpoint');

// POST request
await APIClient.post('/endpoint', data);

// PUT request
await APIClient.put('/endpoint', data);

// DELETE request
await APIClient.delete('/endpoint');

// Set auth token
APIClient.setToken(token);

// Get auth token
const token = APIClient.getToken();
```

---

## Part 4: Using Services in Components

### Example: Login Component
```javascript
import AuthService from '../services/AuthService';
import { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await AuthService.login(email, password);
      console.log('Logged in:', user);
      // Navigate to home
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
```

### Example: Booking Component
```javascript
import BookingService from '../services/BookingService';
import { useEffect, useState } from 'react';

function BookingPage() {
  const [shows, setShows] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    try {
      const showsList = await BookingService.getShows();
      setShows(showsList);
    } catch (error) {
      console.error('Failed to load shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (showId) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const ticket = await BookingService.bookTicket(showId, selectedSeats, userId);
      console.log('Booking successful:', ticket);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  if (loading) return <div>Loading shows...</div>;

  return (
    <div>
      {shows.map(show => (
        <div key={show.id}>
          <h3>{show.name}</h3>
          <button onClick={() => handleBooking(show.id)}>
            Book Tickets
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Part 5: API Endpoints

### User Endpoints
```
POST   /api/users/signup          - Register new user
POST   /api/users/login           - Login user
GET    /api/users/{id}            - Get user profile
PUT    /api/users/{id}            - Update user profile
```

### Show Endpoints
```
GET    /api/shows                 - Get all shows
GET    /api/shows/{id}            - Get show details
POST   /api/shows                 - Create show (admin)
PUT    /api/shows/{id}            - Update show (admin)
DELETE /api/shows/{id}            - Delete show (admin)
```

### Ticket Endpoints
```
POST   /api/tickets/book          - Book ticket
GET    /api/tickets/{id}          - Get ticket details
GET    /api/tickets/show/{showId} - Get show tickets
DELETE /api/tickets/{id}          - Cancel booking
```

### Theatre Endpoints
```
GET    /api/theatres              - Get all theatres
GET    /api/theatres/{id}         - Get theatre details
GET    /api/theatres/city/{cityId} - Get theatres by city
POST   /api/theatres              - Create theatre (admin)
PUT    /api/theatres/{id}         - Update theatre (admin)
DELETE /api/theatres/{id}         - Delete theatre (admin)
```

---

## Part 6: Error Handling

All API services include error handling:
```javascript
try {
  const result = await AuthService.login(email, password);
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error.message);
  // Handle error appropriately
}
```

Common errors:
- **401 Unauthorized**: Invalid credentials or expired token
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Part 7: Development Workflow

### Frontend Development
```bash
# Terminal 1: Run frontend
cd BookMyShow_Advanced
npm run dev

# Terminal 2: Run backend
cd Bookmyshow2
mvn spring-boot:run

# Terminal 3: Monitor backend logs (optional)
tail -f logs/bookmyshow.log
```

### Testing API Endpoints
Use Postman or similar tool:
1. Set base URL to `http://localhost:8080/api`
2. Test endpoints as documented
3. Check response status and data

---

## Part 8: Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to static hosting (Vercel, Netlify, AWS S3, etc.)
```

### Backend
```bash
mvn clean install
# Deploy JAR file to server (AWS, GCP, Digital Ocean, etc.)
```

---

## Troubleshooting

### Backend Won't Start
1. Check Java version: `java -version` (must be 17+)
2. Check MySQL is running: `mysql -u root -p`
3. Check port 8080 is not in use
4. Check logs for errors

### Frontend Can't Connect to Backend
1. Verify backend is running on `http://localhost:8080`
2. Check CORS configuration in `WebConfig.java`
3. Check API URL in `apiConfig.js`
4. Check browser console for network errors

### Database Connection Issues
1. Verify MySQL is running
2. Check credentials in `application.properties`
3. Verify database exists: `SHOW DATABASES;`
4. Check MySQL error log

---

## Next Steps

1. ✅ Backend is configured and ready
2. ✅ Frontend services are created
3. **TODO**: Integrate services into existing components
4. **TODO**: Test all endpoints
5. **TODO**: Implement authentication flow
6. **TODO**: Add error handling UI
7. **TODO**: Implement loading states

---

## Support

For issues or questions:
1. Check backend logs: `mvn clean spring-boot:run`
2. Check browser console: F12 → Console
3. Check network requests: F12 → Network tab
4. Verify API endpoints are accessible via Postman

---

**Integration Status**: ✅ Complete - Ready for testing!
