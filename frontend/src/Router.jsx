import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import ShowTimingsPage from './pages/ShowTimingsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import OffersPage from './pages/OffersPage';
import { UserProfilePage } from './pages/UserProfilePage';
import EventBookingPage from './pages/EventBookingPage';
import TheatreListPage from './pages/TheatreListPage';
import EventDetailsPage from './pages/EventDetailsPage';
import WishlistPage from './pages/WishlistPage';
import LoyaltyPage from './pages/LoyaltyPage';
import NotificationsPage from './pages/NotificationsPage';
import SmartAgent from './components/SmartAgent/SmartAgent';

export function AppRouter() {
  return (
    <>
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Movie flow */}
      <Route path="/movie/:id" element={<MovieDetailsPage />} />
      <Route path="/shows" element={<ShowTimingsPage />} />
      <Route path="/seats" element={<SeatSelectionPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/confirmation" element={<BookingConfirmationPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* User */}
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/bookings" element={<BookingHistoryPage />} />
      <Route path="/settings/payments" element={<PaymentMethodsPage />} />
      <Route path="/offers" element={<OffersPage />} />

      {/* Event / Sport / Play booking */}
      <Route path="/event-booking" element={<EventBookingPage />} />
      <Route path="/event/:id" element={<EventDetailsPage />} />

      {/* Theatres */}
      <Route path="/theatres" element={<TheatreListPage />} />

      {/* User extras */}
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/loyalty" element={<LoyaltyPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* Catch-all */}
      <Route path="*" element={<HomePage />} />
    </Routes>
    <SmartAgent />
    </>
  );
}

export default AppRouter;
