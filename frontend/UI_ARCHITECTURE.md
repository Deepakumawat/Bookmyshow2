# BookMyShow - Complete UI Architecture & User Flow

## 📋 Backend Structure Alignment

This document shows how the UI is designed to match the Java Spring Boot backend data models and API structure.

### Backend Models:
- **User** - Authentication and profile data
- **Show** - Movie/event information with start/end times
- **Theatre** - Cinema details, location, screens
- **Ticket** - Booking records with seat information
- **Screen** - Individual screens within a theatre
- **Seat/ShowSeat** - Seat availability and status

---

## 🎯 Complete User Journey

### **1. Discovery Phase**

#### HomePage (/)
**Purpose**: Initial landing and show discovery  
**Backend Integration**:
- Fetches all shows from: `GET /api/shows`
- Maps shows to display cards with:
  - Show ID, title, start time, duration
  - Rating and genre (if available)
  - Quick book buttons

**User Actions**:
- Browse available shows
- Toggle dark/light theme
- Search for specific shows
- OR click "Start Booking" to select theatre

**Data Flow**:
```
User lands on / → BookingService.getShows() 
→ Shows load in cards → User can browse
```

---

### **2. Authentication Phase**

#### LoginPage (/login)
**Purpose**: User authentication  
**Backend Integration**:
- POST to: `/api/users/login`
- Sends: email, password
- Receives: user object + JWT token
- Stores token in localStorage

**Fields**:
- Email address
- Password
- "Forgot password?" link
- "Create Account" link to /signup

**User Actions**:
- Enter credentials
- Submit form
- Auto-redirect to home on success
- Error message if credentials invalid

**Data Flow**:
```
User submits credentials → AuthService.login()
→ POST /api/users/login → Receive JWT token
→ Store in localStorage → Redirect to /
```

---

#### SignupPage (/signup)
**Purpose**: New user account creation  
**Backend Integration**:
- POST to: `/api/users/signup`
- Sends: name, email, password
- Receives: user object
- Auto-login user

**Fields**:
- Full name
- Email address
- Password
- Confirm password
- Terms & Privacy links

**Validations**:
- All fields required
- Email format check
- Password min 6 characters
- Passwords must match

**User Actions**:
- Fill registration form
- Submit
- Auto-redirect to home
- Account created in database

**Data Flow**:
```
User fills form → AuthService.signup()
→ POST /api/users/signup → User created
→ Auto-login → Redirect to /
```

---

### **3. Booking Phase**

#### TheatreListPage (/theatres)
**Purpose**: Select theatre by city and date  
**Backend Integration**:
- Fetches from: `GET /api/theatres`
- Returns: All theatre objects with:
  - Theatre ID, name, address, city
  - Number of screens
  - Amenities, rating

**User Actions**:
1. Select city (8 major cities)
2. Select date (with date picker)
3. View filtered theatres
4. See theatre details:
   - Name and address
   - Number of screens
   - Amenities (WiFi, Parking, Food Court, etc.)
   - Rating
5. Click "View Shows" for selected theatre

**Data Flow**:
```
User selects city → Filter theatres by city
→ Display theatre cards → User picks theatre
→ Navigate to /shows?theatreId=X&date=Y
```

---

#### ShowListPage (/shows)
**Purpose**: Select show time and format  
**Backend Integration**:
- Fetches from: `GET /api/shows`
- Filters by date and theatre
- Returns: Show objects with:
  - Show ID, start time, end time
  - Duration, format (2D/3D), language
  - Price information

**URL Parameters**:
- `theatreId` - Selected theatre
- `date` - Selected date
- `showId` - (optional) Pre-selected show

**User Actions**:
1. View all shows for theatre/date
2. See show details:
   - Show time (formatted as HH:MM AM/PM)
   - Format badges (2D, Dolby, etc.)
   - Duration and language
   - Starting price
3. Click "Book Now" on selected show

**Show Card Contents**:
```
┌─────────────────────────────┐
│  🎬 02:30 PM               │
│                             │
│  Show Details              │
│  [2D] [Dolby]             │
│                             │
│  ⏱️ 148 mins  🗣️ Hindi    │
│                             │
│  From ₹250                 │
│                             │
│      [Book Now]            │
└─────────────────────────────┘
```

**Data Flow**:
```
User on /shows?theatreId=X&date=Y
→ BookingService.getShows()
→ Filter shows for date Y
→ Display show cards
→ User clicks "Book Now"
→ Navigate to /booking?showId=Z&theatreId=X&date=Y
```

---

#### BookingPage (/booking)
**Purpose**: Select seats and complete booking  
**Backend Integration**:
- Fetches from: `GET /api/shows/{id}` - Show details
- Fetches from: `GET /api/tickets/show/{id}` - Booked seats
- Books via: `POST /api/tickets/book`
- Sends: showId, seatIds[], userId

**URL Parameters**:
- `showId` - Show to book
- `theatreId` - Theatre (optional)
- `date` - Show date (optional)

**Page Sections**:

1. **Theatre Selection**
   - Radio buttons for available theatres
   - Shows theatre name, location, price/seat

2. **Showtime Selection**
   - Buttons for available times
   - Grayed out/disabled for sold-out times

3. **Seating Map**
   - Interactive grid (8 rows × 15 seats)
   - Seat status:
     - ✅ Green: Available
     - ❌ Gray: Booked
     - 🔵 Cyan: Selected
   - Click to toggle seat selection
   - Shows price on hover

4. **Price Breakdown**
   - Per-seat pricing
   - Subtotal
   - Applicable discount/offer
   - Final total

5. **Booking Summary Sidebar**
   - Selected seats list
   - Theatre name
   - Show time and date
   - Total amount

**User Actions**:
1. Select theatre (if multiple options)
2. Select showtime (if multiple times)
3. Click seats to select (can multi-select)
4. Review price breakdown
5. Click "Proceed to Payment"
6. Enter payment details (if integrated)
7. Click "Confirm Booking"

**Data Flow**:
```
User on /booking?showId=X
→ LoadShowDetails(): GET /api/shows/{X}
→ GetAvailableSeats(): GET /api/tickets/show/{X}
→ User selects seats
→ User confirms
→ BookingService.bookTicket(showId, seatIds, userId)
→ POST /api/tickets/book
→ Ticket created in database
→ Show confirmation page
```

---

### **4. Confirmation Phase**

#### Booking Confirmation
**Purpose**: Show booking success  
**Data Displayed**:
- Confirmation icon (✅)
- Booking details:
  - Event title
  - Theatre name
  - Date and showtime
  - Selected seats
  - Total amount paid

**User Actions**:
- Download ticket
- Share booking
- Return to home

**Data Flow**:
```
Booking confirmed → Show details stored
→ Generate confirmation → Display to user
→ Store in booking history
```

---

### **5. Account Phase**

#### UserProfilePage (/profile)
**Purpose**: View and edit user profile  
**Backend Integration**:
- Fetches from: `GET /api/users/{id}` - User profile
- Updates via: `PUT /api/users/{id}` - Edit profile
- Sends: name, email (password changes separately)

**User Info Displayed**:
- Name
- Email address
- Member since date
- Account status

**User Actions**:
- View profile information
- Edit name and email
- Update preferences
- View booking history
- Manage payment methods
- Access loyalty program

**Data Flow**:
```
User clicks profile → AuthService.getCurrentUser()
→ Load user ID → GET /api/users/{id}
→ Display profile → User edits
→ PUT /api/users/{id} → Save changes
```

---

#### BookingHistoryPage (/bookings)
**Purpose**: View all user bookings  
**Backend Integration**:
- Fetches from: `GET /api/tickets` (user-filtered)
- Shows booking history with:
  - Show details
  - Booking date and show time
  - Selected seats
  - Amount paid
  - Booking status

**Tab Sections**:
- Upcoming (future bookings)
- Past (completed bookings)
- Cancelled (cancelled bookings)

**User Actions**:
- View booking details
- Download ticket
- Cancel booking
- Rebook same show
- Rate theatre/show

**Data Flow**:
```
User on /bookings → GET /api/tickets?userId={id}
→ Filter by status → Display bookings
→ User selects booking → Show details
```

---

## 🗺️ Navigation Flow Diagram

```
┌─────────────┐
│  HomePage   │ ← Entry point
│   /         │
└──────┬──────┘
       │
       ├──→ Sign In (/login)
       │     └─→ LoginPage
       │
       ├──→ Sign Up (/signup)
       │     └─→ SignupPage
       │
       └──→ Start Booking
             └─→ TheatreListPage (/theatres)
                 ├─ Select City
                 ├─ Select Date
                 └─→ ShowListPage (/shows?theatreId=X&date=Y)
                     ├─ View Shows
                     ├─ See Amenities
                     └─→ BookingPage (/booking?showId=Z&theatreId=X)
                         ├─ Select Theatre
                         ├─ Select Showtime
                         ├─ Select Seats
                         ├─ Review Price
                         └─→ Confirmation
                             └─→ BookingHistoryPage (/bookings)

Additional Routes:
├─ /profile - User profile management
├─ /wishlist - Saved shows/events
├─ /loyalty - Loyalty program info
├─ /offers - Promotional offers
└─ /settings - Account settings
```

---

## 🔄 API Call Summary

### Authentication Flow
```
SignupPage → POST /api/users/signup
LoginPage → POST /api/users/login
Header → GET user from localStorage
Header (Logout) → Clear localStorage
```

### Booking Discovery
```
HomePage → GET /api/shows
TheatreListPage → GET /api/theatres
ShowListPage → GET /api/shows (filtered)
```

### Booking Process
```
BookingPage (Load) → GET /api/shows/{id}
BookingPage (Load) → GET /api/tickets/show/{id}
BookingPage (Confirm) → POST /api/tickets/book
BookingHistoryPage → GET /api/tickets?userId={id}
```

### User Management
```
UserProfilePage → GET /api/users/{id}
UserProfilePage (Edit) → PUT /api/users/{id}
```

---

## 💾 Database Entities Used

### User Table
- id, name, email, password (hashed), created_at, updated_at
- Used in: Login, Signup, Profile, Booking (userId)

### Theatre Table
- id, name, address, city, rating, amenities, screens[]
- Used in: TheatreListPage, ShowListPage, BookingPage

### Show Table
- id, startTime, endTime, features, screen_id, features[]
- Used in: HomePage, ShowListPage, BookingPage

### Ticket Table
- id, show_id, user_id, seats[], totalPrice, status, created_at
- Used in: BookingPage, BookingHistoryPage, Confirmation

### Seat/ShowSeat Table
- seat_id, show_id, status (available/booked), price_tier
- Used in: BookingPage (availability check)

---

## 🎨 Design System

### Color Scheme
- **Primary**: #E41B32 (Red) - Buttons, highlights
- **Secondary**: #C81426 (Dark Red) - Hover states
- **Background**: Dark theme (#1a1a1a) / Light theme (#ffffff)
- **Text**: Primary (#ffffff dark / #000 light), Secondary (#999)
- **Success**: #10B981 (Green) - Confirmations
- **Error**: #DC2626 (Red) - Error messages

### Responsive Breakpoints
- **Desktop**: 1024px+
- **Tablet**: 768px-1023px
- **Mobile**: <768px

### Typography
- **Headings**: Bold 700 weight, -0.5px letter-spacing
- **Body**: Regular 400 weight, 14-16px size
- **Labels**: Uppercase, 12-13px size, 0.5px letter-spacing

---

## ✅ Implementation Checklist

### Phase 4 (Completed)
- [x] HomePage with API integration
- [x] LoginPage with AuthService
- [x] SignupPage with AuthService
- [x] BookingPage with seat selection
- [x] Header with auth UI
- [x] Router with all routes

### Phase 4.5 (New Theatre UI)
- [x] TheatreListPage (/theatres)
- [x] ShowListPage (/shows)
- [x] Updated Router with new routes
- [x] Theatre selection flow
- [x] Show filtering by date

### Phase 5 (Next)
- [ ] Token refresh mechanism
- [ ] Route guards for protected pages
- [ ] Auto-logout on session expiry
- [ ] Enhanced error messages
- [ ] Email verification

---

## 📊 Current Status

**Backend**: ✅ All endpoints ready  
**Frontend**: ✅ Complete UI structure for booking flow  
**Database**: ✅ MySQL with all tables  
**Integration**: ✅ All pages calling backend APIs  

**Ready for**: End-to-end testing

---

**Last Updated**: 2026-04-20  
**Architecture Version**: 1.0
