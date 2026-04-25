import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BmsHeader from '../components/layout/BmsHeader';
import '../styles/bms-theme.css';
import './MovieDetailsPage.css';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!location.state?.movie);
  const [selectedDate, setSelectedDate] = useState(0);
  const [activeTab, setActiveTab] = useState('About');

  const poster   = movie?.posterUrl   || location.state?.poster   || `https://picsum.photos/seed/bms-movie-${id}/300/450`;
  const backdrop = movie?.backdropUrl || location.state?.backdrop || `https://picsum.photos/seed/bms-backdrop-${id}/1280/560`;

  useEffect(() => {
    // If we already have the movie from router state, skip the fetch
    if (location.state?.movie) { setLoading(false); return; }
    // Try TMDB details first, then fall back to AI movies list
    const API = import.meta.env.VITE_API_BASE || '';
    fetch(`${API}/api/movies/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setMovie(data))
      .catch(() =>
        fetch(`${API}/api/ai/movies`)
          .then((r) => r.json())
          .then((data) => setMovie((data.movies || []).find((m) => String(m.id) === String(id)) || null))
          .catch(() => setMovie(null))
      )
      .finally(() => setLoading(false));
  }, [id]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  if (loading) return (
    <div className="bms-home"><BmsHeader /><div className="bms-spinner" style={{ marginTop: 100 }} /></div>
  );

  if (!movie) return (
    <div className="bms-home">
      <BmsHeader />
      <div className="bmd-not-found">
        <span>🎬</span>
        <h2>Movie not found</h2>
        <button className="bms-btn-red" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );


  return (
    <div className="bms-home">
      <BmsHeader />

      {/* Backdrop Hero */}
      <div className="bmd-hero" style={{ backgroundImage: `url(${backdrop})` }}>
        <div className="bmd-hero-overlay">
          <div className="bms-container bmd-hero-inner">
            <img
              className="bmd-poster"
              src={poster}
              alt={movie.title}
              onError={(e) => { e.target.src = `https://via.placeholder.com/280x420/1e2d47/fff?text=${encodeURIComponent(movie.title || 'Movie')}`; }}
            />
            <div className="bmd-info">
              <h1 className="bmd-title">{movie.title}</h1>
              <div className="bmd-meta-row">
                {movie.imdbRating && (
                  <span className="bmd-imdb">⭐ {movie.imdbRating} / 10</span>
                )}
                {movie.rating && <span className="bms-tag">{movie.rating}</span>}
                {movie.duration && <span className="bmd-meta-item">⏱ {movie.duration}</span>}
                {movie.releaseDate && <span className="bmd-meta-item">📅 {movie.releaseDate}</span>}
              </div>
              <div className="bmd-genre-row">
                {(Array.isArray(movie.genre) ? movie.genre : (movie.genre?.split(',') || ['Drama'])).map((g) => (
                  <span key={g.trim()} className="bmd-genre-tag">{g.trim()}</span>
                ))}
              </div>
              <div className="bmd-lang-row">
                <span className="bmd-lang-label">Available in:</span>
                {(movie.languages || ['Hindi', 'English']).map((l) => (
                  <span key={l} className="bms-tag">{l}</span>
                ))}
              </div>
              <div className="bmd-format-row">
                {(movie.format || ['2D']).map((f) => (
                  <span key={f} className="bmd-format-tag">{f}</span>
                ))}
              </div>
              <div className="bmd-actions">
                <button
                  className="bms-btn-red bmd-book-btn"
                  onClick={() => navigate(`/shows?movieId=${id}&movieTitle=${encodeURIComponent(movie.title)}`)}
                >
                  🎟️ Book Tickets
                </button>
                <button className="bms-btn-outline bmd-wish-btn">♡ Wishlist</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bmd-date-bar">
        <div className="bms-container bmd-dates">
          {dates.map((d, i) => (
            <button
              key={i}
              className={`bmd-date-btn${selectedDate === i ? ' active' : ''}`}
              onClick={() => setSelectedDate(i)}
            >
              <span className="bmd-date-day">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
              <span className="bmd-date-num">{d.getDate()}</span>
              <span className="bmd-date-mon">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bms-container bmd-body">
        {/* Tabs */}
        <div className="bmd-tabs">
          {['About', 'Cast & Crew', 'Reviews'].map((t) => (
            <button
              key={t}
              className={`bmd-tab${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'About' && (
          <div className="bmd-about">
            <div className="bmd-card">
              <h3 className="bmd-card-title">Synopsis</h3>
              <p className="bmd-synopsis">
                {movie.description || 'An epic cinematic experience that takes you on a journey through time and space. With breathtaking visuals and a compelling storyline, this movie promises to be one of the most unforgettable experiences of the year.'}
              </p>
            </div>
            <div className="bmd-card">
              <h3 className="bmd-card-title">Movie Details</h3>
              <div className="bmd-details-grid">
                {movie.director && <DetailRow label="Director" value={movie.director} />}
                {movie.duration && <DetailRow label="Duration" value={movie.duration} />}
                {movie.releaseDate && <DetailRow label="Release Date" value={movie.releaseDate} />}
                <DetailRow label="Language" value={(movie.languages || ['Hindi']).join(', ')} />
                <DetailRow label="Genre" value={Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || 'Drama')} />
                <DetailRow label="Format" value={(movie.format || ['2D']).join(', ')} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Cast & Crew' && (
          <div className="bmd-cast-grid">
            {movie.director && (
              <div className="bmd-cast-card">
                <div className="bmd-cast-avatar" style={{ background: '#4a3080', overflow: 'hidden' }}>
                  {movie.director[0]}
                </div>
                <span className="bmd-cast-name">{movie.director}</span>
                <span className="bmd-cast-role">Director</span>
              </div>
            )}
            {(movie.castDetails || (movie.cast || []).map(name => ({ name, character: 'Actor', profileUrl: null }))).map((c, i) => (
              <div key={i} className="bmd-cast-card">
                {c.profileUrl
                  ? <img src={c.profileUrl} alt={c.name} className="bmd-cast-avatar"
                      style={{ objectFit: 'cover', border: 'none' }}
                      onError={e => { e.target.style.display='none'; e.target.nextSibling?.style.removeProperty('display'); }} />
                  : null}
                <div className="bmd-cast-avatar" style={{ display: c.profileUrl ? 'none' : undefined }}>
                  {c.name?.[0] || '?'}
                </div>
                <span className="bmd-cast-name">{c.name}</span>
                <span className="bmd-cast-role">{c.character || 'Actor'}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="bmd-reviews">
            {SAMPLE_REVIEWS.map((r) => (
              <div key={r.id} className="bmd-review-card">
                <div className="bmd-review-header">
                  <div className="bmd-review-avatar">{r.name[0]}</div>
                  <div>
                    <div className="bmd-review-name">{r.name}</div>
                    <div className="bmd-review-stars">{'⭐'.repeat(r.stars)}</div>
                  </div>
                  <span className="bmd-review-date">{r.date}</span>
                </div>
                <p className="bmd-review-text">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="bmd-detail-row">
      <span className="bmd-detail-label">{label}</span>
      <span className="bmd-detail-value">{value}</span>
    </div>
  );
}

const SAMPLE_REVIEWS = [
  { id: 1, name: 'Rahul Sharma', stars: 5, date: '15 Apr 2024', text: 'Absolutely brilliant! The cinematography is stunning and the story grips you from the very first scene. A must-watch!' },
  { id: 2, name: 'Priya Patel', stars: 4, date: '12 Apr 2024', text: 'Great movie with excellent performances. The second half could have been tighter but overall a very enjoyable experience.' },
  { id: 3, name: 'Amit Verma', stars: 5, date: '10 Apr 2024', text: 'One of the best films I have seen this year. The visuals are breathtaking and the music is extraordinary.' },
];
