# BookMyShow - Quick Start Guide

## ⚡ 5-Minute Setup

### Backend Setup (Terminal 1)
```bash
# 1. Navigate to backend
cd /c/bookmyshow-backend

# 2. Build backend
mvn clean install

# 3. Run backend
mvn spring-boot:run

# ✅ Backend ready on: http://localhost:8080/api
```

### MySQL Database Setup
```bash
# 1. Start MySQL
mysql -u root -p

# 2. Create database (if not exists)
CREATE DATABASE bookmyshow;

# 3. Exit MySQL
exit
```

### Frontend Setup (Terminal 2)
```bash
# 1. Navigate to frontend
cd C:\BookMyShow_Advanced

# 2. Install dependencies (first time only)
npm install

# 3. Run frontend
npm run dev

# ✅ Frontend ready on: http://localhost:5182
```

---

## 🧪 Quick Test

### Test User Registration
**Using Postman or curl:**
```bash
curl -X POST http://localhost:8080/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Test User Login
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Show Retrieval
```bash
curl -X GET http://localhost:8080/api/shows
```

---

## 📱 Frontend Integration Examples

### 1. Use in Login Component
```javascript
import AuthService from '../services/AuthService';

const handleLogin = async () => {
  try {
    const user = await AuthService.login(email, password);
    console.log('Logged in:', user);
    // Navigate to home
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

### 2. Use in Booking Component
```javascript
import BookingService from '../services/BookingService';

useEffect(() => {
  const loadShows = async () => {
    try {
      const shows = await BookingService.getShows();
      setShows(shows);
    } catch (error) {
      console.error('Failed to load shows:', error);
    }
  };
  loadShows();
}, []);

const handleBookTicket = async (showId, seatIds) => {
  try {
    const userId = AuthService.getCurrentUser().id;
    const ticket = await BookingService.bookTicket(showId, seatIds, userId);
    console.log('Booking successful:', ticket);
  } catch (error) {
    console.error('Booking failed:', error.message);
  }
};
```

### 3. Use in Theatre Component
```javascript
import TheatreService from '../services/TheatreService';

useEffect(() => {
  const loadTheatres = async () => {
    try {
      const theatres = await TheatreService.getAllTheatres();
      setTheatres(theatres);
    } catch (error) {
      console.error('Failed to load theatres:', error);
    }
  };
  loadTheatres();
}, []);
```

---

## 🔑 Key Files

### Backend
- **Controllers**: `/src/main/java/Bookmyshow2/controllers/`
  - `UserController.java` - User/Auth endpoints
  - `TicketController.java` - Booking endpoints
  - `ShowController.java` - Show endpoints
  - `TheatreController.java` - Theatre endpoints

- **Services**: `/src/main/java/Bookmyshow2/services/`
  - `UserService.java` - User business logic
  - `TicketService.java` - Booking business logic

- **Config**: `/src/main/java/Bookmyshow2/config/`
  - `WebConfig.java` - CORS configuration

- **Properties**: `/src/main/resources/application.properties`

### Frontend
- **Services**: `/src/services/`
  - `APIClient.js` - HTTP client
  - `AuthService.js` - Auth logic
  - `BookingService.js` - Booking logic
  - `TheatreService.js` - Theatre logic

- **Config**: `/src/config/apiConfig.js` - API endpoints

---

## 🚀 What's Working

✅ **Backend**
- User registration/login
- Show management
- Ticket booking
- Theatre management
- CORS enabled
- Error handling
- Database integration

✅ **Frontend**
- API client with auth support
- All service layers
- Error handling
- Token management
- Configuration management

---

## 📋 Next Steps

1. **Integrate services into existing components**
   - Update LoginPage to use AuthService
   - Update BookingPage to use BookingService
   - Update HomePage to use BookingService for shows

2. **Test all features**
   - Sign up / Login
   - Browse shows
   - Book tickets
   - View bookings

3. **Add loading and error states**
   - Show spinners while loading
   - Display error messages
   - Handle network failures

4. **Deploy**
   - Build frontend: `npm run build`
   - Deploy backend JAR to server
   - Configure database on production

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Java 17+, MySQL running, port 8080 free |
| CORS error | Verify `WebConfig.java` has correct origins |
| API 404 errors | Check endpoint URLs in `apiConfig.js` |
| Login fails | Verify user was created, check credentials |
| Database errors | Ensure MySQL running, database exists |

---

## 📞 Support

- Check browser console (F12 → Console)
- Check network requests (F12 → Network)
- Check backend logs in terminal
- Verify API with Postman before debugging frontend

---

**Status**: ✅ Ready to use! Start terminals and test endpoints.
