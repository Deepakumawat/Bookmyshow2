# BookMyShow Advanced - Complete Sitemap & Navigation Guide

## 🗺️ Website Architecture Overview

```
📍 ROOT: http://localhost:5178

📱 Main Navigation
├─ 🏠 HOME (/)
├─ 🎬 MOVIES (/)
├─ 🎪 EVENTS (/)
├─ 🎭 PLAYS (/)
├─ ⚽ SPORTS (/)
├─ 📺 STREAMING (/)
├─ 🎁 OFFERS (/offers)
├─ 📋 MY BOOKINGS (/bookings)
└─ 👤 USER MENU
   ├─ 👤 Profile (/profile)
   ├─ 💝 Wishlist (/wishlist)
   ├─ ⭐ Loyalty Program (/loyalty)
   ├─ 📬 Notifications (/notifications)
   ├─ ⚙️ Settings - Payments (/settings/payments)
   ├─ 🔔 Settings - Notifications (/settings/notifications)
   ├─ 🗺️ User Journey (/journey)
   └─ 📋 Help (/)
```

---

## 🌳 Complete Route Tree

### Tier 1: Primary Navigation
```
/
├─ / (HomePage) - Root & Category Pages
│  ├─ Hero Banner (Featured Events)
│  ├─ Now Showing Carousel
│  ├─ AI Recommendations Section
│  ├─ Feature Highlights
│  └─ Footer
│
├─ /event/:eventId (EventDetailsPage)
│  ├─ Event Poster & Info
│  ├─ Metadata (Genre, Language, Director, Year)
│  ├─ Rating & Reviews
│  ├─ Tabs:
│  │  ├─ Overview
│  │  ├─ Reviews & Ratings
│  │  └─ Theaters (for movies)
│  ├─ Book Now Button
│  ├─ Add to Wishlist Button
│  └─ Similar Events Carousel
│
└─ /offers (OffersPage)
   ├─ Active Offers List
   ├─ Filter by Type
   ├─ Terms & Conditions
   ├─ Copy Promo Code
   └─ View Offer Details
```

### Tier 2: Booking Flow
```
/booking (BookingPage) - 3-Step Flow
├─ Step 1: Seating Selection
│  ├─ Theater Selection
│  │  ├─ PVR Cinemas Downtown (₹250/seat)
│  │  ├─ INOX Leisure (₹280/seat)
│  │  └─ Cinepolis Grand (₹300/seat)
│  │
│  ├─ Showtime Selection
│  │  ├─ 10:30 AM (Available)
│  │  ├─ 2:30 PM (Available)
│  │  ├─ 6:00 PM (Available)
│  │  └─ 9:30 PM (Sold Out)
│  │
│  └─ Seat Selection
│     ├─ Interactive 8×15 Grid (120 seats)
│     ├─ Color Coding:
│     │  ├─ Green = Available
│     │  ├─ Gray = Booked
│     │  └─ Cyan = Selected
│     └─ Real-time Price Update
│
├─ Step 2: Payment & Confirmation
│  ├─ Price Summary
│  │  ├─ Seat Price Breakdown
│  │  ├─ Applicable Discount
│  │  └─ Final Total
│  │
│  ├─ Apply Promo Code
│  │
│  └─ Payment Method Selection
│     ├─ 💳 Credit Card
│     ├─ 💳 Debit Card
│     ├─ 📱 UPI
│     ├─ 🏦 Net Banking
│     ├─ 🪙 Wallet
│     └─ 📊 EMI
│
└─ Step 3: Confirmation
   ├─ Booking Confirmed ✅
   ├─ Booking Details
   ├─ Download Ticket Button
   ├─ Share with Friends Button
   └─ Back to Home Button
```

### Tier 3: User Account Pages
```
/profile (UserProfilePage)
├─ Profile Header
│  ├─ Avatar/Initials
│  ├─ Name, Email, Phone
│  └─ Location
│
├─ Edit Profile Form
│  ├─ Personal Details
│  ├─ Favorite Genres (Add/Remove)
│  ├─ Favorite Theaters (Add/Remove)
│  └─ Save/Cancel Buttons
│
└─ Notification Preferences
   ├─ Email Notifications (Toggle)
   ├─ SMS Notifications (Toggle)
   ├─ Push Notifications (Toggle)
   └─ Notification Types:
      ├─ Bookings
      ├─ Offers
      ├─ Reminders
      └─ Loyalty Updates

/wishlist (WishlistPage)
├─ Wishlist Header
│  ├─ Title: "My Wishlist"
│  ├─ Item Count
│  └─ Clear All Button
│
├─ Filter Buttons
│  ├─ All (n items)
│  ├─ Movies (n items)
│  ├─ Plays (n items)
│  ├─ Events (n items)
│  ├─ Sports (n items)
│  └─ Streaming (n items)
│
├─ Wishlist Grid
│  └─ WishlistCard (per item)
│     ├─ Poster Image
│     ├─ Title
│     ├─ Type Badge
│     ├─ Rating
│     ├─ Added Date
│     ├─ Book Now Button
│     └─ Remove Button
│
└─ Empty State (if no items)
   ├─ Icon
   ├─ Message
   └─ Browse Events Link

/loyalty (LoyaltyPage)
├─ Tier Status Section
│  ├─ Current Tier (Silver/Gold/Platinum)
│  ├─ Progress Bar
│  ├─ Points towards next tier
│  └─ Estimated days to next tier
│
├─ Points Display
│  ├─ Total Points
│  ├─ Points Earned (This Month)
│  ├─ Points Redeemed
│  └─ Expiry Information
│
├─ Tier Benefits
│  ├─ Current Tier Benefits
│  ├─ Next Tier Benefits (Preview)
│  └─ All Tiers Comparison
│
├─ Redemption Options
│  ├─ Discount Coupons (100, 200, 300+ points)
│  ├─ Free Booking Vouchers
│  ├─ Concession Upgrades
│  ├─ Premium Seating
│  ├─ Partner Offers
│  └─ Point Calculator
│
├─ Points History
│  ├─ Transaction List
│  ├─ Filter by Type (Earned/Redeemed)
│  └─ Sort by Date
│
└─ FAQ Section
   ├─ How to Earn Points?
   ├─ How to Redeem Points?
   ├─ Tier Progression Rules
   └─ Expiry Policy

/notifications (NotificationsPage)
├─ Notification Preferences Sidebar
│  ├─ Channel Preferences
│  │  ├─ Email (Toggle)
│  │  ├─ SMS (Toggle)
│  │  └─ Push (Toggle)
│  │
│  └─ Notification Type Preferences
│     ├─ Bookings (Toggle)
│     ├─ Offers (Toggle)
│     ├─ Reminders (Toggle)
│     └─ Loyalty (Toggle)
│
├─ Notification Tabs
│  ├─ All (Unread count)
│  ├─ Bookings
│  ├─ Offers
│  ├─ Reminders
│  └─ Loyalty
│
├─ Notification List
│  └─ Per Notification:
│     ├─ Icon (by type)
│     ├─ Title
│     ├─ Message
│     ├─ Timestamp
│     ├─ Action Buttons
│     ├─ Mark as Read Toggle
│     └─ Delete Button
│
└─ Actions
   ├─ Mark All as Read
   ├─ Clear All
   └─ Save Preferences

/bookings (BookingHistoryPage)
├─ Tabs
│  ├─ Upcoming (Future bookings)
│  ├─ Past (Completed bookings)
│  └─ Cancelled
│
├─ Filters
│  ├─ Date Range
│  ├─ Event Type
│  └─ Status
│
├─ Booking List
│  └─ Per Booking Card:
│     ├─ Event Poster
│     ├─ Event Title
│     ├─ Theater Name
│     ├─ Date & Time
│     ├─ Seat Numbers
│     ├─ Booking Status
│     └─ Actions:
│        ├─ View Details
│        ├─ Download Ticket
│        ├─ Cancel Booking
│        ├─ Rebook
│        └─ Write Review (after event)
│
└─ Booking Details Modal
   ├─ Full Event Info
   ├─ Theater Details
   ├─ Seating Information
   ├─ Price Breakdown
   ├─ Booking Reference ID
   └─ Cancellation Policy
```

### Tier 4: Settings Pages
```
/settings/payments (PaymentMethodsPage)
├─ Payment Methods List
│  └─ Per Saved Method:
│     ├─ Payment Type Icon
│     ├─ Last 4 Digits
│     ├─ Expiry Date
│     ├─ Default Badge (if default)
│     ├─ Make Default Button
│     ├─ Edit Button
│     └─ Delete Button
│
├─ Add Payment Method Form
│  ├─ Payment Type Selector
│  ├─ Card/UPI/Banking Details
│  ├─ Save for Future (Checkbox)
│  ├─ Make Default (Checkbox)
│  └─ Add Method Button
│
└─ Saved Addresses
   ├─ Address List
   └─ Add/Edit Address

/settings/notifications (NotificationSettingsPage)
├─ Channel Preferences
│  ├─ Email Notifications
│  │  ├─ All (Toggle)
│  │  ├─ Bookings (Toggle)
│  │  ├─ Offers (Toggle)
│  │  ├─ Reminders (Toggle)
│  │  └─ Loyalty (Toggle)
│  │
│  ├─ SMS Notifications
│  │  └─ Same as Email
│  │
│  └─ Push Notifications
│     └─ Same as Email
│
├─ Frequency Settings
│  ├─ Marketing Emails (Daily/Weekly/Monthly)
│  ├─ Offer Alerts (Immediate/Digest)
│  └─ Event Reminders (2 hours/1 day before)
│
├─ Unsubscribe Options
│  ├─ Unsubscribe from all
│  ├─ Unsubscribe from marketing
│  └─ Manage by type
│
└─ Save Preferences Button
```

### Tier 5: Visualization & Help
```
/journey (UserJourneyPage)
├─ Page Header
│  ├─ Title: "Complete User Journey Map"
│  └─ Subtitle: "Explore how all phases connect"
│
├─ Phase Overview Section
│  ├─ Phase 1: Discovery & Exploration
│  │  ├─ Expandable Card
│  │  └─ Features: Homepage, Category Selection, Smart Search, Filters & Tags
│  │
│  ├─ Phase 2: User Profile & Personalization
│  │  ├─ Expandable Card
│  │  └─ Features: User Profile, Wishlist, Reviews & Ratings, AI Recommendations
│  │
│  └─ Phase 3: Booking & Transaction
│     ├─ Expandable Card
│     └─ Features: Event Details, Seating Selection, Payment Methods, Loyalty Points, Notifications
│
├─ User Flows Section
│  ├─ Discovery to Booking (8 steps)
│  ├─ Wishlist to Booking (6 steps)
│  ├─ Profile Optimization (5 steps)
│  └─ Loyalty Progression (5 steps)
│
├─ Integration Points Section
│  ├─ Phase 1 ↔ Phase 2 Connections
│  ├─ Phase 2 ↔ Phase 3 Connections
│  ├─ Phase 3 ↔ Phase 2 Connections
│  └─ Cross-Phase Integrations
│
├─ Feature Matrix
│  ├─ Features vs Phases Grid
│  └─ Connection Indicators
│
└─ Get Started Section
   ├─ Explore Home
   ├─ Complete Profile
   ├─ Build Wishlist
   └─ View Loyalty
```

---

## 🔗 Key Navigation Flows

### User Discovery Flow
```
HomePage
  ↓
Browse/Search Events
  ↓
EventDetailsPage
  ↓
View Reviews & Theater Info
  ↓
Book Now Button
  ↓
BookingPage (Seating)
  ↓
Select Seats, Theater, Showtime
  ↓
Proceed to Payment
  ↓
BookingPage (Payment)
  ↓
Choose Payment Method & Discount
  ↓
Confirm Booking
  ↓
BookingPage (Confirmation)
  ↓
Success! View Loyalty Points
  ↓
Download Ticket or Back to Home
```

### Wishlist Flow
```
EventDetailsPage
  ↓
Add to Wishlist Button
  ↓
Saved to WishlistContext
  ↓
Navigate to WishlistPage
  ↓
View Saved Events
  ↓
Click Book Now
  ↓
DirectNavigateFromWishlistToBooking()
  ↓
BookingPage (with event pre-selected)
  ↓
Continue with booking flow
```

### Profile Update Flow
```
HomePage
  ↓
User Menu → Profile
  ↓
UserProfilePage
  ↓
Edit Preferences (Genres, Theaters)
  ↓
Save Changes (localStorage)
  ↓
HomePage Re-renders
  ↓
RecommendationEngine Uses Updated Preferences
  ↓
Better Recommendations Shown
```

### Loyalty Accumulation Flow
```
BookingPage (Confirmation)
  ↓
completeBookingAndNotify()
  ↓
Calculate Points: (totalPrice / 100) * 50
  ↓
Update LoyaltyContext
  ↓
Add Points to UserProfile
  ↓
Check for Tier Upgrade
  ↓
Create Loyalty Notification
  ↓
Display in LoyaltyPage
  ↓
Points History Updated
```

---

## 🎯 Quick Access Buttons

### From Header (Always Accessible)
- 🏠 BookMyShow Logo → Home
- 🔍 Search Bar → Filtered Results
- 🌙 Theme Toggle → Dark/Light Mode
- 🔔 Notification Bell → Recent Notifications
- 👤 User Profile → Profile Menu

### From User Menu Dropdown
1. 👤 Profile
2. 💝 Wishlist
3. ⭐ Loyalty Program
4. 📬 Notifications
5. ⚙️ Settings (Payments)
6. 🔔 Settings (Notifications)
7. 🗺️ User Journey
8. 📋 Help

### From HomePage
- 🎬 Now Showing → NowShowingCarousel (click card → Event Details)
- ✨ Recommendations → RecommendationSection (click card → Event Details)
- View All → Browse All Events (same category)

### From EventDetailsPage
- 📅 Book Now → BookingPage
- 🤍 Add to Wishlist → Save & Highlight Button
- View Theater Details → Theater Information Panel

### From BookingPage
- ← Back to Seating (payment step)
- → Proceed to Payment (seating step)
- 🏠 Back to Home (confirmation step)

### From WishlistPage
- 📅 Book Now → BookingPage (with event)
- ❌ Remove → Remove from Wishlist
- 🔍 Browse Events → Back to Home

### From LoyaltyPage
- View Benefits → Tier Information
- Redeem Points → Redemption Options
- View History → Points Transactions

---

## 📱 Mobile Navigation

### Hamburger Menu (Mobile)
```
☰ (Mobile Menu)
  ├─ Movies
  ├─ Events
  ├─ Plays
  ├─ Sports
  ├─ Streaming
  ├─ Offers
  ├─ My Bookings
  └─ User Menu
     ├─ Profile
     ├─ Wishlist
     ├─ Loyalty
     ├─ Notifications
     ├─ Settings
     ├─ Journey Map
     └─ Help
```

### Bottom Navigation (Alternative)
```
🏠 Home | 🔍 Search | 💝 Wishlist | 👤 Profile
```

---

## 🚀 Getting Started Paths

### New User Path
1. Visit `/` (HomePage)
2. Browse through recommendations
3. Click on interesting event
4. Go to `/profile` to set preferences
5. Add events to `/wishlist`
6. Book through `/booking`
7. View `/loyalty` to see earned points
8. Visit `/journey` to understand the platform

### Existing User Path
1. Visit `/` (HomePage)
2. See personalized recommendations
3. Check `/notifications` for alerts
4. View `/bookings` for past events
5. Add to `/wishlist` for future bookings
6. Check `/loyalty` for redemptions

### Quick Booking Path
1. Visit `/` (HomePage)
2. Click recommendation
3. Click "Book Now" on EventDetailsPage
4. Select seats on BookingPage
5. Complete payment
6. View confirmation

---

## 📊 Navigation Statistics

- **Total Routes**: 12
- **Total Pages**: 13
- **Header Links**: 5 (Logo, Search, Theme, Notifications, Profile)
- **Main Navigation Items**: 8
- **User Menu Items**: 8
- **Settings Pages**: 2
- **Information Pages**: 1

---

**Last Updated**: April 2026  
**Status**: ✅ Complete & Functional  
**Server**: http://localhost:5178  

