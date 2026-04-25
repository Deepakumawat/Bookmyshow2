import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bms-user');
    if (saved) return JSON.parse(saved);
    return {
      id: null,
      isLoggedIn: false,
      name: 'Guest User',
      email: 'guest@bookmyshow.ai',
      loyaltyPoints: 0,
      loyaltyTier: 'Bronze', // Bronze, Silver, Gold, Platinum
      savedPaymentMethods: [],
      preferences: {
        favoriteGenres: [],
        favoriteTheaters: [],
        language: 'English',
      },
    };
  });

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('bms-user', JSON.stringify(updatedUser));
  };

  const addLoyaltyPoints = (points) => {
    const newTotal = user.loyaltyPoints + points;
    let newTier = user.loyaltyTier;

    // Tier calculation: 0-999 Bronze, 1000-4999 Silver, 5000-9999 Gold, 10000+ Platinum
    if (newTotal >= 10000) newTier = 'Platinum';
    else if (newTotal >= 5000) newTier = 'Gold';
    else if (newTotal >= 1000) newTier = 'Silver';

    updateUser({
      loyaltyPoints: newTotal,
      loyaltyTier: newTier,
    });

    return newTier !== user.loyaltyTier ? { pointsAdded: points, tierUpgraded: true, newTier } : { pointsAdded: points, tierUpgraded: false };
  };

  const redeemLoyaltyPoints = (points) => {
    if (user.loyaltyPoints < points) return { success: false, message: 'Insufficient points' };
    updateUser({ loyaltyPoints: user.loyaltyPoints - points });
    return { success: true, pointsRedeemed: points, discountAmount: Math.floor(points / 100) };
  };

  const addPaymentMethod = (method) => {
    const updatedMethods = [...user.savedPaymentMethods, { ...method, id: `PM${Date.now()}` }];
    updateUser({ savedPaymentMethods: updatedMethods });
    return updatedMethods[updatedMethods.length - 1];
  };

  const removePaymentMethod = (methodId) => {
    const updatedMethods = user.savedPaymentMethods.filter((m) => m.id !== methodId);
    updateUser({ savedPaymentMethods: updatedMethods });
  };

  const login = (userDetails) => {
    const loginData = {
      ...user,
      ...userDetails,
      isLoggedIn: true,
    };
    updateUser(loginData);
  };

  const logout = () => {
    const guestUser = {
      id: null,
      isLoggedIn: false,
      name: 'Guest User',
      email: 'guest@bookmyshow.ai',
      loyaltyPoints: 0,
      loyaltyTier: 'Bronze',
      savedPaymentMethods: [],
      preferences: {
        favoriteGenres: [],
        favoriteTheaters: [],
        language: 'English',
      },
    };
    setUser(guestUser);
    localStorage.removeItem('bms-user');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        addLoyaltyPoints,
        redeemLoyaltyPoints,
        addPaymentMethod,
        removePaymentMethod,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
