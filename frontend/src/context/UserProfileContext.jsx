import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserProfileContext = createContext();

const defaultUserProfile = {
  id: 'user_' + Date.now(),
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91-9876543210',
  profilePicture: '👨‍💼',
  city: 'Mumbai',
  address: '123 Movie Street, Mumbai',
  createdAt: new Date(),
  preferences: {
    favoriteGenres: ['Action', 'Drama', 'Sci-Fi'],
    favoriteLanguages: ['Hindi', 'English'],
    favoriteTheaters: ['PVR Cinemas Downtown', 'INOX Leisure'],
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  },
};

export function UserProfileProvider({ children }) {
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(defaultUserProfile);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load user profile:', e);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const updateProfile = (updates) => {
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    return updated;
  };

  const updatePreferences = (preferenceUpdates) => {
    const updated = {
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        ...preferenceUpdates,
      },
    };
    setUserProfile(updated);
    return updated;
  };

  const addFavoriteGenre = (genre) => {
    if (!userProfile.preferences.favoriteGenres.includes(genre)) {
      updatePreferences({
        favoriteGenres: [...userProfile.preferences.favoriteGenres, genre],
      });
    }
  };

  const removeFavoriteGenre = (genre) => {
    updatePreferences({
      favoriteGenres: userProfile.preferences.favoriteGenres.filter((g) => g !== genre),
    });
  };

  const addFavoriteTheater = (theater) => {
    if (!userProfile.preferences.favoriteTheaters.includes(theater)) {
      updatePreferences({
        favoriteTheaters: [...userProfile.preferences.favoriteTheaters, theater],
      });
    }
  };

  const removeFavoriteTheater = (theater) => {
    updatePreferences({
      favoriteTheaters: userProfile.preferences.favoriteTheaters.filter((t) => t !== theater),
    });
  };

  const startEditingProfile = () => {
    setEditFormData(userProfile);
    setIsEditing(true);
  };

  const cancelEditingProfile = () => {
    setIsEditing(false);
    setEditFormData(defaultUserProfile);
  };

  const saveEditedProfile = (updates) => {
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    setIsEditing(false);
    return updated;
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        isEditing,
        editFormData,
        setEditFormData,
        updateProfile,
        updatePreferences,
        addFavoriteGenre,
        removeFavoriteGenre,
        addFavoriteTheater,
        removeFavoriteTheater,
        startEditingProfile,
        cancelEditingProfile,
        saveEditedProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
}
