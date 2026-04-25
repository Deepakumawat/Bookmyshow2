import { BrowserRouter } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
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
                                    <UserProvider>
                                      <AppRouter />
                                      <Toast />
                                    </UserProvider>
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
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
