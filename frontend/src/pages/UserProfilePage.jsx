import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import BmsHeader from '../components/layout/BmsHeader';
import '../styles/bms-theme.css';
import './UserProfilePage.css';

export function UserProfilePage() {
  const {
    userProfile,
    isEditing,
    startEditingProfile,
    cancelEditingProfile,
    saveEditedProfile,
    addFavoriteGenre,
    removeFavoriteGenre,
    addFavoriteTheater,
    removeFavoriteTheater,
  } = useUserProfile();

  const [formData, setFormData] = useState(userProfile);
  const [newGenre, setNewGenre] = useState('');
  const [newTheater, setNewTheater] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    saveEditedProfile(formData);
  };

  const handleAddGenre = () => {
    if (newGenre.trim()) {
      addFavoriteGenre(newGenre.trim());
      setNewGenre('');
    }
  };

  const handleAddTheater = () => {
    if (newTheater.trim()) {
      addFavoriteTheater(newTheater.trim());
      setNewTheater('');
    }
  };

  const availableGenres = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'Animation',
    'Adventure',
    'Fantasy',
  ];

  const suggestedTheaters = [
    'PVR Cinemas',
    'INOX Leisure',
    'Cinepolis',
    'Carnival Cinemas',
    'IMAX',
  ];

  return (
    <div className="user-profile-page">
      <BmsHeader />
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-picture">
            <span className="avatar-emoji">{userProfile.profilePicture}</span>
          </div>

          <div className="profile-info">
            <h1>{userProfile.name}</h1>
            {userProfile.email && !userProfile.email.endsWith('@mobile.bms') && (
              <p className="profile-email">{userProfile.email}</p>
            )}
            {userProfile.email && userProfile.email.endsWith('@mobile.bms') && (
              <p className="profile-phone">📱 +91-{userProfile.email.replace('@mobile.bms', '')}</p>
            )}
            {userProfile.phone && !userProfile.email?.endsWith('@mobile.bms') && (
              <p className="profile-phone">{userProfile.phone}</p>
            )}
            <p className="profile-location">📍 {userProfile.city}</p>
          </div>

          {!isEditing && (
            <button className="btn-edit-profile" onClick={startEditingProfile}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="edit-profile-section">
            <h2>Edit Profile</h2>
            <form className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-save" onClick={handleSave}>
                  💾 Save Changes
                </button>
                <button type="button" className="btn-cancel" onClick={cancelEditingProfile}>
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Preferences Section */}
        <div className="preferences-section">
          <h2>🎬 Preferences</h2>

          {/* Favorite Genres */}
          <div className="preference-group">
            <h3>Favorite Genres</h3>
            <div className="preference-items">
              {userProfile.preferences.favoriteGenres.map((genre) => (
                <div key={genre} className="preference-tag">
                  <span>{genre}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeFavoriteGenre(genre)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="add-preference">
              <select
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                className="preference-select"
              >
                <option value="">Select a genre to add...</option>
                {availableGenres
                  .filter((g) => !userProfile.preferences.favoriteGenres.includes(g))
                  .map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
              </select>
              <button className="btn-add" onClick={handleAddGenre}>
                + Add Genre
              </button>
            </div>
          </div>

          {/* Favorite Languages */}
          <div className="preference-group">
            <h3>Favorite Languages</h3>
            <div className="preference-items">
              {userProfile.preferences.favoriteLanguages.map((lang) => (
                <div key={lang} className="preference-tag lang-tag">
                  <span>{lang}</span>
                </div>
              ))}
            </div>
            <p className="preference-note">Languages are auto-detected from your region</p>
          </div>

          {/* Favorite Theaters */}
          <div className="preference-group">
            <h3>Favorite Theaters</h3>
            <div className="preference-items">
              {userProfile.preferences.favoriteTheaters.map((theater) => (
                <div key={theater} className="preference-tag">
                  <span>{theater}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeFavoriteTheater(theater)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="add-preference">
              <select
                value={newTheater}
                onChange={(e) => setNewTheater(e.target.value)}
                className="preference-select"
              >
                <option value="">Select a theater to add...</option>
                {suggestedTheaters
                  .filter((t) => !userProfile.preferences.favoriteTheaters.includes(t))
                  .map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
              <button className="btn-add" onClick={handleAddTheater}>
                + Add Theater
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="preference-group">
            <h3>📧 Notification Settings</h3>
            <div className="notification-settings">
              <label className="notification-checkbox">
                <input type="checkbox" defaultChecked={userProfile.preferences.emailNotifications} />
                <span>Email Notifications</span>
              </label>
              <label className="notification-checkbox">
                <input type="checkbox" defaultChecked={userProfile.preferences.smsNotifications} />
                <span>SMS Notifications</span>
              </label>
              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  defaultChecked={userProfile.preferences.pushNotifications}
                />
                <span>Push Notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
