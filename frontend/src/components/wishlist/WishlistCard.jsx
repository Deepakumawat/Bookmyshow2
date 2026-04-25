import React from 'react';
import './WishlistCard.css';

export function WishlistCard({ item, onRemove, onBook }) {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderRating = (rating) => {
    if (!rating) return 'Not rated';
    return `${rating} ⭐`;
  };

  const getTypeColor = (type) => {
    const colors = {
      movie: '#ff6b6b',
      play: '#4ecdc4',
      event: '#45b7d1',
      sports: '#f7b731',
      streaming: '#a55eea',
    };
    return colors[type?.toLowerCase()] || '#999';
  };

  return (
    <div className="wishlist-card">
      <div className="wishlist-card-image">
        {item.image ? (
          <img src={item.image} alt={item.title} />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <span className="type-badge" style={{ background: getTypeColor(item.type) }}>
          {item.type}
        </span>
      </div>

      <div className="wishlist-card-content">
        <h4 className="wishlist-card-title">{item.title}</h4>

        <div className="wishlist-card-meta">
          <span className="meta-item">
            <strong>Rating:</strong> {renderRating(item.rating)}
          </span>
          <span className="meta-item">
            <strong>Added:</strong> {formatDate(item.addedAt)}
          </span>
        </div>

        <div className="wishlist-card-actions">
          <button className="btn-book" onClick={() => onBook?.(item)}>
            📅 Book Now
          </button>
          <button className="btn-remove" onClick={() => onRemove?.(item.id)}>
            💔 Remove
          </button>
        </div>
      </div>
    </div>
  );
}
