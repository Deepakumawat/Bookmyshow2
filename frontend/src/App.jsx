import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';
import { BookingProvider } from './context/BookingContext';
import { UserProvider } from './context/UserContext';
import { CategoryProvider } from './context/CategoryContext';
import { FilterProvider } from './context/FilterContext';
import { SeatSelectionProvider } from './context/SeatSelectionContext';
import { PricingProvider } from './context/PricingContext';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { TheaterProvider } from './context/TheaterContext';
import { PaymentProvider } from './context/PaymentContext';
import { OfferProvider } from './context/OfferContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserProfileProvider } from './context/UserProfileContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewProvider } from './context/ReviewContext';
import { Toast } from './components/notifications/Toast';
import AppRouter from './Router';
import './styles/theme.css';
import './App.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeProvider>
          <NotificationProvider>
            <UserProvider>
              <UserProfileProvider>
                <WishlistProvider>
                  <ReviewProvider>
                    <CategoryProvider>
                      <FilterProvider>
                        <SearchProvider>
                          <BookingProvider>
                            <SeatSelectionProvider>
                              <PricingProvider>
                                <LoyaltyProvider>
                                  <TheaterProvider>
                                    <PaymentProvider>
                                      <OfferProvider>
                                        <AppRouter />
                                        <Toast />
                                      </OfferProvider>
                                    </PaymentProvider>
                                  </TheaterProvider>
                                </LoyaltyProvider>
                              </PricingProvider>
                            </SeatSelectionProvider>
                          </BookingProvider>
                        </SearchProvider>
                      </FilterProvider>
                    </CategoryProvider>
                  </ReviewProvider>
                </WishlistProvider>
              </UserProfileProvider>
            </UserProvider>
          </NotificationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
