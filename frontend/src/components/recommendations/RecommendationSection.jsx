import React, { useMemo } from 'react';
import { useUserProfile } from '../../context/UserProfileContext';
import { createRecommendationEngine } from '../../utils/recommendationEngine';
import './RecommendationSection.css';

export function RecommendationSection({ allEvents, onEventSelect }) {
  const { userProfile } = useUserProfile();

  const recommendations = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return [];

    const engine = createRecommendationEngine(userProfile);
    return engine.getPersonalizedRecommendations(allEvents, 6);
  }, [userProfile, allEvents]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const handleBookClick = (event) => {
    onEventSelect?.(event);
  };

  const renderReason = (sources) => {
    if (sources.includes('genre')) {
      return `Based on your love for ${userProfile.preferences.favoriteGenres[0]}`;
    }
    if (sources.includes('language')) {
      return `Available in ${userProfile.preferences.favoriteLanguages[0]}`;
    }
    if (sources.includes('trending')) {
      return `Trending this week`;
    }
    return `Recommended for you`;
  };

  return (
    <section className="recommendation-section">
      <div className="recommendation-header">
        <div className="recommendation-title">
          <span className="sparkle">✨</span>
          <h2>Recommended For You</h2>
        </div>
        <p className="recommendation-subtitle">
          Personalized suggestions based on your preferences
        </p>
      </div>

      <div className="recommendation-grid">
        {recommendations.map((event) => (
          <div key={event.id} className="recommendation-card">
            <div className="rec-card-image">
              {event.image ? (
                <img src={event.image} alt={event.title} />
              ) : (
                <div className="no-image-placeholder">📷</div>
              )}
              <div className="rec-sources">
                {event.sources?.map((source) => (
                  <span key={source} className="source-badge">
                    {source === 'genre' && '🎬'}
                    {source === 'language' && '🗣️'}
                    {source === 'trending' && '🔥'}
                  </span>
                ))}
              </div>
            </div>

            <div className="rec-card-content">
              <h4 className="rec-card-title">{event.title}</h4>

              <div className="rec-card-rating">
                <span className="stars">
                  {'⭐'.repeat(Math.round(event.rating))}
                </span>
                <span className="rating-value">{event.rating.toFixed(1)}</span>
              </div>

              <p className="rec-reason">{renderReason(event.sources)}</p>

              <button
                className="btn-book-rec"
                onClick={() => handleBookClick(event)}
              >
                📅 Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
