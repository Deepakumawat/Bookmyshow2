import React, { useState, useContext } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { WishlistCard } from '../components/wishlist/WishlistCard';
import { ThemeContext } from '../context/ThemeContext';
import IntegrationService from '../utils/integrationService';
import './WishlistPage.css';

export function WishlistPage() {
  const { wishlist, removeFromWishlist, getWishlistByType, clearWishlist } = useWishlist();
  const { isDark } = useContext(ThemeContext);
  const [selectedType, setSelectedType] = useState(null);

  const displayItems = selectedType
    ? getWishlistByType(selectedType)
    : wishlist;

  const types = ['movie', 'play', 'event', 'sports', 'streaming'];
  const typeCounts = types.reduce((acc, type) => {
    acc[type] = getWishlistByType(type).length;
    return acc;
  }, {});

  const handleRemove = (eventId) => {
    removeFromWishlist(eventId);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure? This will remove all items from your wishlist.')) {
      clearWishlist();
    }
  };

  const handleBook = (item) => {
    IntegrationService.navigateFromWishlistToBooking(item);
  };

  return (
    <div className={`wishlist-page ${isDark ? '' : 'light'}`}>
      <div className="wishlist-header">
        <div className="wishlist-title-section">
          <h1>💝 My Wishlist</h1>
          <p className="wishlist-count">
            {displayItems.length} item{displayItems.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {wishlist.length > 0 && (
          <button className="btn-clear-wishlist" onClick={handleClear}>
            🗑️ Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-icon">💭</div>
          <h3>Your Wishlist is Empty</h3>
          <p>Save movies, events, plays, and more to your wishlist!</p>
          <a href="/" className="btn-browse">
            🔍 Browse Events
          </a>
        </div>
      ) : (
        <>
          <div className="wishlist-filters">
            <button
              className={`filter-btn ${selectedType === null ? 'active' : ''}`}
              onClick={() => setSelectedType(null)}
            >
              All ({wishlist.length})
            </button>
            {types.map((type) => (
              <button
                key={type}
                className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} ({typeCounts[type]})
              </button>
            ))}
          </div>

          {displayItems.length === 0 ? (
            <div className="no-items-message">
              No {selectedType} items in your wishlist
            </div>
          ) : (
            <div className="wishlist-grid">
              {displayItems.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onBook={handleBook}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
