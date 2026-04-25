import React, { createContext, useContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load wishlist:', e);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (event) => {
    const exists = wishlist.find((item) => item.id === event.id);
    if (!exists) {
      const newItem = {
        id: event.id,
        title: event.title,
        image: event.image,
        type: event.type,
        rating: event.rating,
        addedAt: new Date(),
      };
      setWishlist((prev) => [newItem, ...prev]);
      return newItem;
    }
    return null;
  };

  const removeFromWishlist = (eventId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== eventId));
  };

  const isInWishlist = (eventId) => {
    return wishlist.some((item) => item.id === eventId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const getWishlistByType = (type) => {
    return wishlist.filter((item) => item.type === type);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const sortWishlistByDate = (order = 'desc') => {
    const sorted = [...wishlist].sort((a, b) => {
      const dateA = new Date(a.addedAt);
      const dateB = new Date(b.addedAt);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
        getWishlistByType,
        clearWishlist,
        sortWishlistByDate,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
