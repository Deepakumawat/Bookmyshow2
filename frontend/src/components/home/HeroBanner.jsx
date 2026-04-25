import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { heroBanners } from '../../data/heroBanners';

export function HeroBanner() {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const isDark = theme === 'dark';

  const currentBanner = heroBanners[currentIndex];

  // Auto-rotate banners
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
    setAutoPlay(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        overflow: 'hidden',
        borderRadius: '12px',
        marginBottom: 40,
      }}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Banner Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${currentBanner.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 0.8s ease',
        }}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px',
            color: 'white',
            animation: 'fadeInUp 0.8s ease',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            {/* Genre Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {currentBanner.genre.map((g) => (
                <span
                  key={g}
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1
              style={{
                margin: '0 0 12px 0',
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {currentBanner.title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                margin: '0 0 16px 0',
                fontSize: 18,
                fontWeight: 500,
                opacity: 0.95,
              }}
            >
              {currentBanner.subtitle}
            </p>

            {/* Description */}
            <p
              style={{
                margin: '0 0 24px 0',
                fontSize: 14,
                opacity: 0.85,
                maxWidth: '500px',
                lineHeight: 1.6,
              }}
            >
              {currentBanner.description}
            </p>

            {/* Rating and Year */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: 12, opacity: 0.8 }}>Rating</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                  ⭐ {currentBanner.rating}/5
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: 12, opacity: 0.8 }}>Year</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                  {currentBanner.year}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => window.location.href = currentBanner.ctaLink}
              style={{
                padding: '14px 32px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🎫 {currentBanner.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.3)',
          border: 'none',
          color: 'white',
          fontSize: 28,
          width: 50,
          height: 50,
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.5)';
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.3)';
          e.target.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.3)',
          border: 'none',
          color: 'white',
          fontSize: 28,
          width: 50,
          height: 50,
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.5)';
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.3)';
          e.target.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        ›
      </button>

      {/* Dots Navigation */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 10,
        }}
      >
        {heroBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentIndex ? 32 : 10,
              height: 10,
              background: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'white';
            }}
            onMouseLeave={(e) => {
              if (index !== currentIndex) {
                e.target.style.background = 'rgba(255,255,255,0.5)';
              }
            }}
          />
        ))}
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
