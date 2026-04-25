import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export function NowShowingCarousel({ events = [] }) {
  const { theme } = useTheme();
  const [scrollPos, setScrollPos] = useState(0);

  const isDark = theme === 'dark';

  const scroll = (direction) => {
    const container = document.getElementById('now-showing-scroll');
    if (!container) return;

    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setScrollPos(Math.max(0, scrollPos - scrollAmount));
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPos(scrollPos + scrollAmount);
    }
  };

  const mockEvents = events.length > 0 ? events : [
    { id: 1, title: 'Avatar 2', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=450&fit=crop', rating: 4.8, type: 'Movie' },
    { id: 2, title: 'Oppenheimer', image: 'https://images.unsplash.com/photo-1533613220915-609f24a17fd9?w=300&h=450&fit=crop', rating: 4.7, type: 'Movie' },
    { id: 3, title: 'Barbie', image: 'https://images.unsplash.com/photo-1489599849228-ed4dc59b2c84?w=300&h=450&fit=crop', rating: 4.5, type: 'Movie' },
    { id: 4, title: 'Killers', image: 'https://images.unsplash.com/photo-1594909122845-11bced63c160?w=300&h=450&fit=crop', rating: 4.6, type: 'Movie' },
    { id: 5, title: 'The Marvels', image: 'https://images.unsplash.com/photo-1517604931442-7e0c6e4a9396?w=300&h=450&fit=crop', rating: 4.3, type: 'Movie' },
  ];

  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>🎬 Now Showing</h2>
        <a href="/" style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          View All →
        </a>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Scroll Container */}
        <div
          id="now-showing-scroll"
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            paddingBottom: 12,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {mockEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => window.location.href = `/event/${event.id}`}
              style={{
                flex: '0 0 auto',
                width: '200px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image */}
              <div
                style={{
                  height: '280px',
                  backgroundImage: `url(${event.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                {/* Rating Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  ⭐ {event.rating}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 12 }}>
                <p style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>
                  {event.title}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/event/${event.id}`;
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => scroll('left')}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: isDark ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isDark ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)';
            e.target.style.color = 'var(--text-primary)';
          }}
        >
          ‹
        </button>

        <button
          onClick={() => scroll('right')}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: isDark ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isDark ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)';
            e.target.style.color = 'var(--text-primary)';
          }}
        >
          ›
        </button>

        {/* Hide scrollbar */}
        <style>{`
          #now-showing-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
