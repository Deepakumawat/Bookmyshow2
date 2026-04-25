import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';

export const UserProfileContext = createContext();

const defaultPreferences = {
  favoriteGenres: ['Action', 'Drama', 'Sci-Fi'],
  favoriteLanguages: ['Hindi', 'English'],
  favoriteTheaters: ['PVR Cinemas Downtown', 'INOX Leisure'],
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
};

export function UserProfileProvider({ children }) {
  const { user } = useContext(UserContext);

  const buildProfile = (u) => ({
    id: u?.id || 'user_' + Date.now(),
    name: u?.name || 'Guest User',
    email: u?.email || '',
    phone: u?.phone || '',
    profilePicture: '👨‍💼',
    city: u?.city || 'Mumbai',
    address: '',
    createdAt: new Date(),
    preferences: defaultPreferences,
  });

  const [userProfile, setUserProfile] = useState(() => buildProfile(user));
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(() => buildProfile(user));

  // Sync profile whenever logged-in user changes
  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Always override name/email from real user context
        const merged = { ...parsed, name: user?.name || parsed.name, email: user?.email || parsed.email };
        setUserProfile(merged);
        setEditFormData(merged);
        return;
      } catch (e) {}
    }
    const fresh = buildProfile(user);
    setUserProfile(fresh);
    setEditFormData(fresh);
  }, [user?.name, user?.email]);

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
