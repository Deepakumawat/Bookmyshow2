import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BmsHeader from '../components/layout/BmsHeader';
import AIApiService from '../services/AIApiService';
import { FALLBACK_MOVIES, FALLBACK_COMING_SOON, FALLBACK_PREMIERES, FALLBACK_EVENTS, FALLBACK_SPORTS, FALLBACK_PLAYS } from '../data/fallbackData';
import '../styles/bms-theme.css';
import './HomePage.css';

// Image helpers — use real TMDB URLs when available
const mposter  = (id) => `https://picsum.photos/seed/bms-m${id}/300/450`;
const mevent   = (id) => `https://picsum.photos/seed/bms-ev${id}/400/225`;
const msport   = (id) => `https://picsum.photos/seed/bms-sp${id}/400/225`;
const mplay    = (id) => `https://picsum.photos/seed/bms-pl${id}/400/225`;
const mbanner  = (id) => `https://picsum.photos/seed/bms-bn${id}/1280/480`;
const poster   = (m)  => m?.posterUrl   || mposter(m?.id ?? 1);
const backdrop = (m)  => m?.backdropUrl || mbanner(m?.id ?? 1);

const LANGS   = ['All', 'Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi'];
const GENRES  = ['All', 'Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi', 'Romance', 'Horror'];
const FORMATS = ['All', '2D', '3D', 'IMAX', '4DX'];
const SPORT_CATS = ['All', 'Cricket', 'Football', 'Kabaddi', 'Badminton', 'Tennis'];
const EVENT_CATS = ['All', 'Concert', 'Comedy', 'Festival', 'Cultural'];
const CITIES     = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Jaipur', 'Pune'];

const OFFERS = [
  { icon: '💳', title: '50% off on HDFC cards', sub: 'Up to ₹150 off on 2 tickets', code: 'HDFC50' },
  { icon: '🎟️', title: 'Buy 1 Get 1 Free',      sub: 'Every Tuesday with Paytm',   code: 'BOGO' },
  { icon: '🏦', title: 'No Cost EMI',            sub: 'On bookings above ₹1000',    code: 'NOCOSTEMI' },
  { icon: '⚡', title: 'Flash Sale — 30% off',   sub: 'Today only, limited seats',  code: 'FLASH30' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'Movies');
  const city = localStorage.getItem('bms_city') || 'Jaipur';

  // Movies state — pre-filled with fallback so cards never stay empty
  const [movies,      setMovies]      = useState(FALLBACK_MOVIES);
  const [comingSoon,  setComingSoon]  = useState(FALLBACK_COMING_SOON);
  const [premieres,   setPremieres]   = useState(FALLBACK_PREMIERES);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [csLoading,   setCsLoading]   = useState(false);
  const [prLoading,   setPrLoading]   = useState(false);

  // Filters
  const [langFilter,   setLangFilter]   = useState('All');
  const [genreFilter,  setGenreFilter]  = useState('All');
  const [formatFilter, setFormatFilter] = useState('All');

  // Events / Sports / Plays state — pre-filled with fallback
  const [events,        setEvents]       = useState(FALLBACK_EVENTS);
  const [sports,        setSports]       = useState(FALLBACK_SPORTS);
  const [plays,         setPlays]        = useState(FALLBACK_PLAYS);
  const [eventsLoading, setEventsLoading]= useState(false);
  const [sportsLoading, setSportsLoading]= useState(false);
  const [playsLoading,  setPlaysLoading] = useState(false);
  const [eventCat,      setEventCat]     = useState('All');
  const [sportCat,      setSportCat]     = useState('All');
  const [eventsCity,    setEventsCity]   = useState(city);

  // Banner
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerSlides = movies.length > 0
    ? movies.slice(0, 3).map((m, i) => ({ ...m, bg: m.bgColor || ['#1a0a3e','#0a1a30','#1a0a0a'][i] }))
    : [
        { id:'b1', title:'Book Movie Tickets',        bg:'#1a0a3e', description:'Experience the best of Indian cinema' },
        { id:'b2', title:'Live Events & Experiences', bg:'#0a1a2e', description:'Concerts, comedy, festivals & more' },
        { id:'b3', title:'Catch Live Sports Action',  bg:'#0a1a10', description:'IPL, ISL, PKL and more' },
      ];

  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % bannerSlides.length), 4500);
    return () => clearInterval(t);
  }, [bannerSlides.length]);

  // Lazy load each tab
  useEffect(() => {
    if (activeTab === 'Movies') {
      if (!movies.length)     loadMovies();
      if (!comingSoon.length) loadComingSoon();
      if (!premieres.length)  loadPremieres();
    }
    if (activeTab === 'Events' && !events.length) loadEvents();
    if (activeTab === 'Sports' && !sports.length) loadSports();
    if (activeTab === 'Plays'  && !plays.length)  loadPlays();
  }, [activeTab]);

  const loadMovies    = useCallback(async () => { setMoviesLoading(true); try { const d = await AIApiService.getMovies();    if (d?.length) setMovies(d); } catch {} finally { setMoviesLoading(false); } }, []);
  const loadComingSoon= useCallback(async () => { setCsLoading(true);     try { const d = await AIApiService.getComingSoon(); if (d?.length) setComingSoon(d); } catch {} finally { setCsLoading(false); } }, []);
  const loadPremieres = useCallback(async () => { setPrLoading(true);     try { const d = await AIApiService.getPremieres();  if (d?.length) setPremieres(d); } catch {} finally { setPrLoading(false); } }, []);
  const loadEvents    = useCallback(async () => { setEventsLoading(true); try { const d = await AIApiService.getEvents(eventsCity); if (d?.length) setEvents(d); } catch {} finally { setEventsLoading(false); } }, [eventsCity]);
  const loadSports    = useCallback(async () => { setSportsLoading(true); try { const d = await AIApiService.getSports();    if (d?.length) setSports(d); } catch {} finally { setSportsLoading(false); } }, []);
  const loadPlays     = useCallback(async () => { setPlaysLoading(true);  try { const d = await AIApiService.getPlays(eventsCity); if (d?.length) setPlays(d); } catch {} finally { setPlaysLoading(false); } }, [eventsCity]);

  const filteredMovies = movies.filter((m) => {
    if (langFilter   !== 'All' && !m.languages?.includes(langFilter)) return false;
    if (genreFilter  !== 'All' && !m.genre?.includes(genreFilter))    return false;
    if (formatFilter !== 'All' && !m.format?.includes(formatFilter))  return false;
    return true;
  });

  const filteredEvents = eventCat === 'All' ? events : events.filter((e) => e.category === eventCat);
  const filteredSports = sportCat === 'All' ? sports : sports.filter((s) => s.sport === sportCat);

  const topCharts = [...movies].sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0)).slice(0, 10);
  const recommended = movies.slice(0, 6);

  const slide = bannerSlides[bannerIdx];

  return (
    <div className="bms-home">
      <BmsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div className="bms-banner" style={{ background: slide.bg || '#1a0a3e' }}>
        <img
          key={slide.id}
          className="bms-banner-bg"
          src={backdrop(slide)}
          alt=""
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="bms-banner-overlay" />
        <div className="bms-container bms-banner-content">
          <span className="bms-badge">
            {activeTab === 'Movies' ? 'NOW SHOWING' : activeTab === 'Sports' ? 'LIVE SPORTS' : activeTab === 'Events' ? 'LIVE EVENTS' : 'THEATRE'}
          </span>
          <h1 className="bms-banner-title">{slide.title || 'Discover & Book'}</h1>
          <p className="bms-banner-sub">{slide.description || 'Real-time AI • Instant booking • Best seats'}</p>
          <button className="bms-btn-red bms-banner-btn" onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}>
            Explore Now
          </button>
        </div>
        <div className="bms-banner-dots">
          {bannerSlides.map((_, i) => (
            <span key={i} className={`bms-banner-dot${i === bannerIdx ? ' active' : ''}`} onClick={() => setBannerIdx(i)} />
          ))}
        </div>
      </div>

      <div className="bms-container bms-home-body">

        {/* ══ MOVIES TAB ══════════════════════════════════════════════ */}
        {activeTab === 'Movies' && (
          <>
            {/* Language quick-filter strip */}
            <div className="bms-lang-strip">
              {LANGS.map((l) => (
                <button key={l} className={`bms-lang-chip${langFilter === l ? ' active' : ''}`} onClick={() => setLangFilter(l)}>{l}</button>
              ))}
            </div>

            {/* ── Recommended For You ───────────────────────────────── */}
            <section className="bms-section">
              <div className="bms-section-header">
                <h2 className="bms-section-title">Recommended For You</h2>
                <span className="bms-ai-badge">⚡ AI Powered</span>
              </div>
              {moviesLoading
                ? <HScrollSkeleton type="movie" count={5} />
                : recommended.length === 0
                  ? <EmptyState icon="🎬" msg="Loading recommendations…" onRefresh={loadMovies} />
                  : (
                    <HScroll>
                      {recommended.map((m, i) => (
                        <MovieCard key={m.id ?? i} movie={m} poster={poster(m)}
                          onClick={() => navigate(`/movie/${m.id}`, { state: { movie: m, poster: poster(m) } })} />
                      ))}
                    </HScroll>
                  )
              }
            </section>

            {/* ── Premieres ─────────────────────────────────────────── */}
            <section className="bms-section">
              <div className="bms-section-header">
                <h2 className="bms-section-title">Premieres</h2>
                <span className="bms-premiere-badge">🎬 EXCLUSIVE</span>
              </div>
              {prLoading
                ? <HScrollSkeleton type="premiere" count={4} />
                : premieres.length === 0
                  ? null
                  : (
                    <HScroll>
                      {premieres.map((p, i) => (
                        <PremiereCard key={p.id ?? i} premiere={p} poster={poster(p)} />
                      ))}
                    </HScroll>
                  )
              }
            </section>

            {/* ── Now Showing ───────────────────────────────────────── */}
            <section className="bms-section">
              <div className="bms-section-header">
                <h2 className="bms-section-title">Now Showing</h2>
                <div className="bms-filter-chips-inline">
                  {FORMATS.map((f) => (
                    <button key={f} className={`bms-fmt-chip${formatFilter === f ? ' active' : ''}`} onClick={() => setFormatFilter(f)}>{f}</button>
                  ))}
                </div>
              </div>
              {moviesLoading
                ? <div className="bms-movie-grid">{Array.from({length:8},(_,i)=><SkeletonMovieCard key={i}/>)}</div>
                : filteredMovies.length === 0
                  ? <EmptyState icon="🎬" msg="No movies found. Try different filters." onRefresh={loadMovies} />
                  : (
                    <div className="bms-movie-grid">
                      {filteredMovies.map((m, i) => (
                        <MovieCard key={m.id ?? i} movie={m} poster={poster(m)}
                          onClick={() => navigate(`/movie/${m.id}`, { state: { movie: m, poster: poster(m) } })} />
                      ))}
                    </div>
                  )
              }
            </section>

            {/* ── Coming Soon ───────────────────────────────────────── */}
            <section className="bms-section">
              <div className="bms-section-header">
                <h2 className="bms-section-title">Coming Soon</h2>
                <span className="bms-ai-badge">⚡ AI Powered</span>
              </div>
              {csLoading
                ? <HScrollSkeleton type="movie" count={5} />
                : comingSoon.length === 0
                  ? null
                  : (
                    <HScroll>
                      {comingSoon.map((m, i) => (
                        <ComingSoonCard key={m.id ?? i} movie={m} poster={poster(m)} />
                      ))}
                    </HScroll>
                  )
              }
            </section>

            {/* ── Top Charts ────────────────────────────────────────── */}
            {topCharts.length > 0 && (
              <section className="bms-section">
                <div className="bms-section-header">
                  <h2 className="bms-section-title">Top Charts</h2>
                  <span className="bms-top-label">🏆 Most Liked</span>
                </div>
                <div className="bms-top-chart-grid">
                  {topCharts.map((m, i) => (
                    <TopChartRow key={m.id ?? i} rank={i+1} movie={m} poster={poster(m)}
                      onClick={() => navigate(`/movie/${m.id}`, { state: { movie: m, poster: poster(m) } })} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ══ EVENTS TAB ══════════════════════════════════════════════ */}
        {activeTab === 'Events' && (
          <>
            <div className="bms-filters-wrap">
              <FilterRow label="Category" options={EVENT_CATS} value={eventCat} onChange={setEventCat} />
              <div className="bms-filter-group">
                <span className="bms-filter-label">City</span>
                <div className="bms-scroll-row">
                  {CITIES.map((c) => (
                    <button key={c} className={`bms-pill${eventsCity === c ? ' active' : ''}`}
                      onClick={() => { setEventsCity(c); setEvents([]); }}>📍 {c}</button>
                  ))}
                </div>
              </div>
            </div>
            <section className="bms-section">
              <div className="bms-section-header">
                <h2 className="bms-section-title">Events in {eventsCity}</h2>
                <span className="bms-ai-badge">⚡ AI Powered</span>
              </div>
              {eventsLoading
                ? <div className="bms-event-grid">{Array.from({length:6},(_,i)=><SkeletonEventCard key={i}/>)}</div>
                : filteredEvents.length === 0
                  ? <EmptyState icon="🎤" msg="No events found. Try a different city." onRefresh={loadEvents} />
                  : <div className="bms-event-grid">
                      {filteredEvents.map((ev, i) => (
                        <EventCard key={ev.id??i} event={ev} image={mevent(ev.id??i+1)}
                          onBook={() => navigate('/event-booking', { state: { item: ev, type: 'event', image: mevent(ev.id??i+1) } })} />
                      ))}
                    </div>
              }
            </section>
          </>
        )}

        {/* ══ SPORTS TAB ══════════════════════════════════════════════ */}
        {activeTab === 'Sports' && (
          <>
            <div className="bms-filters-wrap">
              <FilterRow label="Sport" options={SPORT_CATS} value={sportCat} onChange={setSportCat} />
            </div>
            <section className="bms-section">
              <div className="bms-section-header">
                <h2 className="bms-section-title">Upcoming Matches & Tournaments</h2>
                <span className="bms-ai-badge">⚡ AI Powered</span>
              </div>
              {sportsLoading
                ? <div className="bms-event-grid">{Array.from({length:6},(_,i)=><SkeletonEventCard key={i}/>)}</div>
                : filteredSports.length === 0
                  ? <EmptyState icon="🏆" msg="No sports events found." onRefresh={loadSports} />
                  : <div className="bms-event-grid">
                      {filteredSports.map((sp, i) => (
                        <SportCard key={sp.id??i} sport={sp} image={msport(sp.id??i+1)}
                          onBook={() => navigate('/event-booking', { state: { item: sp, type: 'sport', image: msport(sp.id??i+1) } })} />
                      ))}
                    </div>
              }
            </section>
          </>
        )}

        {/* ══ PLAYS TAB ═══════════════════════════════════════════════ */}
        {activeTab === 'Plays' && (
          <>
            <div className="bms-filters-wrap">
              <div className="bms-filter-group">
                <span className="bms-filter-label">City</span>
                <div className="bms-scroll-row">
                  {CITIES.map((c) => (
                    <button key={c} className={`bms-pill${eventsCity === c ? ' active' : ''}`}
                      onClick={() => { setEventsCity(c); setPlays([]); }}>📍 {c}</button>
                  ))}
                </div>
              </div>
            </div>
            <section className="bms-section">
              <div className="bms-section-header">
                <h2 className="bms-section-title">Theatre & Plays in {eventsCity}</h2>
                <span className="bms-ai-badge">⚡ AI Powered</span>
              </div>
              {playsLoading
                ? <div className="bms-event-grid">{Array.from({length:6},(_,i)=><SkeletonEventCard key={i}/>)}</div>
                : plays.length === 0
                  ? <EmptyState icon="🎭" msg="No plays found. Try a different city." onRefresh={loadPlays} />
                  : <div className="bms-event-grid">
                      {plays.map((pl, i) => (
                        <PlayCard key={pl.id??i} play={pl} image={mplay(pl.id??i+1)}
                          onBook={() => navigate('/event-booking', { state: { item: pl, type: 'play', image: mplay(pl.id??i+1) } })} />
                      ))}
                    </div>
              }
            </section>
          </>
        )}

        {/* ══ STREAM ══════════════════════════════════════════════════ */}
        {activeTab === 'Stream' && <StreamTab navigate={navigate} />}

        {/* ══ ACTIVITIES ══════════════════════════════════════════════ */}
        {activeTab === 'Activities' && (
          <div className="bms-coming-soon-tab">
            <span className="bms-coming-soon-icon">🎯</span>
            <h2>Activities</h2>
            <p>Adventure sports, workshops & experiences coming soon!</p>
          </div>
        )}

        {/* ══ OFFERS ══════════════════════════════════════════════════ */}
        <section className="bms-section">
          <h2 className="bms-section-title">Offers & Promotions</h2>
          <div className="bms-offers-grid">
            {OFFERS.map((o) => (
              <div key={o.code} className="bms-offer-card">
                <span className="bms-offer-icon">{o.icon}</span>
                <div className="bms-offer-info">
                  <div className="bms-offer-title">{o.title}</div>
                  <div className="bms-offer-sub">{o.sub}</div>
                </div>
                <span className="bms-offer-code">{o.code}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="bms-footer">
        <div className="bms-container bms-footer-inner">
          <div className="bms-footer-logo">book<span>my</span>show</div>
          <div className="bms-footer-links">
            <a href="#">About Us</a><a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a><a href="#">Terms</a><a href="#">FAQs</a>
          </div>
          <p className="bms-footer-copy">© 2026 Bigtree Entertainment Pvt. Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card components
// ─────────────────────────────────────────────────────────────────────────────

function MovieCard({ movie, poster, onClick }) {
  const pct = movie.imdbRating ? Math.min(99, Math.round(movie.imdbRating * 10)) : 87;
  const votes = movie.votes || `${Math.floor(Math.random() * 200 + 50)}K`;
  return (
    <div className="bms-movie-card" onClick={onClick}>
      <div className="bms-movie-poster-wrap">
        <img className="bms-movie-poster" src={poster} alt={movie.title}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/mv${movie.id}/300/450`; }} />
        <div className="bms-movie-overlay">
          <button className="bms-book-btn">Book Tickets</button>
        </div>
        {movie.certification && <div className="bms-movie-cert">{movie.certification}</div>}
      </div>
      <div className="bms-movie-info">
        <h3 className="bms-movie-title">{movie.title}</h3>
        <div className="bms-movie-liked">
          <span className="bms-liked-thumb">👍</span>
          <span className="bms-liked-pct">{pct}% Liked It</span>
          <span className="bms-liked-votes">{votes} Votes</span>
        </div>
        <div className="bms-movie-tags">
          {(movie.languages?.slice(0,2) || [movie.language || 'Hindi']).map((l) => <span key={l} className="bms-tag">{l}</span>)}
          {(movie.format?.slice(0,2) || ['2D']).map((f) => <span key={f} className="bms-tag">{f}</span>)}
        </div>
      </div>
    </div>
  );
}

function PremiereCard({ premiere, poster }) {
  return (
    <div className="bms-premiere-card">
      <div className="bms-premiere-poster-wrap">
        <img src={poster} alt={premiere.title} className="bms-premiere-poster"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/pr${premiere.id}/260/380`; }} />
        <div className="bms-premiere-banner">PREMIERE</div>
      </div>
      <div className="bms-premiere-info">
        <h3 className="bms-premiere-title">{premiere.title}</h3>
        <div className="bms-premiere-date">📅 {premiere.premiereDate}</div>
        <div className="bms-premiere-venue">📍 {premiere.venue}, {premiere.city}</div>
        <div className="bms-premiere-price">₹{premiere.price?.toLocaleString('en-IN') || '999'} onwards</div>
        <button className="bms-btn-red bms-premiere-btn">Book Premiere</button>
      </div>
    </div>
  );
}

function ComingSoonCard({ movie, poster }) {
  const [notified, setNotified] = useState(false);
  return (
    <div className="bms-cs-card">
      <div className="bms-cs-poster-wrap">
        <img src={poster} alt={movie.title} className="bms-cs-poster"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/cs${movie.id}/260/380`; }} />
        <div className="bms-cs-date-badge">{movie.releaseLabel || movie.releaseDate}</div>
      </div>
      <div className="bms-cs-info">
        <h3 className="bms-cs-title">{movie.title}</h3>
        <div className="bms-movie-tags" style={{ marginBottom: 10 }}>
          {(movie.genre?.slice(0,2) || ['Drama']).map((g) => <span key={g} className="bms-tag">{g}</span>)}
        </div>
        <button
          className={`bms-notify-btn${notified ? ' notified' : ''}`}
          onClick={() => setNotified(!notified)}
        >
          {notified ? '🔔 Notified' : '🔔 Notify Me'}
        </button>
      </div>
    </div>
  );
}

function TopChartRow({ rank, movie, poster, onClick }) {
  const pct = movie.imdbRating ? Math.min(99, Math.round(movie.imdbRating * 10)) : 87;
  return (
    <div className="bms-chart-row" onClick={onClick}>
      <div className={`bms-chart-rank${rank <= 3 ? ' top' : ''}`}>{rank}</div>
      <img src={poster} alt={movie.title} className="bms-chart-thumb"
        onError={(e) => { e.target.src = `https://picsum.photos/seed/tc${movie.id}/60/90`; }} />
      <div className="bms-chart-info">
        <div className="bms-chart-title">{movie.title}</div>
        <div className="bms-chart-meta">
          {(movie.genre?.slice(0,2) || ['Drama']).join(' • ')}
          {movie.language ? ` • ${movie.language}` : ''}
        </div>
      </div>
      <div className="bms-chart-right">
        <div className="bms-chart-liked">👍 {pct}%</div>
        <button className="bms-chart-book bms-btn-red" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          Book
        </button>
      </div>
    </div>
  );
}

function EventCard({ event, image, onBook }) {
  return (
    <div className="bms-event-card">
      <div className="bms-event-img-wrap">
        <img className="bms-event-img" src={image} alt={event.title}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/ev${event.id}/400/225`; }} />
        <span className="bms-event-cat-badge">{event.category}</span>
      </div>
      <div className="bms-event-info">
        <h3 className="bms-event-title">{event.title}</h3>
        <div className="bms-event-artist">{event.artist}</div>
        <div className="bms-event-meta"><span>📅 {event.date}</span><span>⏰ {event.time}</span></div>
        <div className="bms-event-meta"><span>📍 {event.venue}, {event.city}</span></div>
        <div className="bms-event-footer">
          <span className="bms-event-price">₹{event.price?.min ?? 500} onwards</span>
          <button className="bms-btn-red bms-event-book-btn" onClick={onBook}>Book Now</button>
        </div>
      </div>
    </div>
  );
}

function SportCard({ sport, image, onBook }) {
  return (
    <div className="bms-event-card">
      <div className="bms-event-img-wrap">
        <img className="bms-event-img" src={image} alt={sport.title}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/sp${sport.id}/400/225`; }} />
        <span className="bms-event-cat-badge" style={{ background: '#e67e22' }}>{sport.sport}</span>
        {sport.league && <span className="bms-sport-league">{sport.league}</span>}
      </div>
      <div className="bms-event-info">
        <h3 className="bms-event-title">{sport.title}</h3>
        {sport.teams && (
          <div className="bms-sport-teams">
            <span className="bms-team">{sport.teams[0]}</span>
            <span className="bms-vs">VS</span>
            <span className="bms-team">{sport.teams[1]}</span>
          </div>
        )}
        <div className="bms-event-meta"><span>📅 {sport.date}</span><span>⏰ {sport.time}</span></div>
        <div className="bms-event-meta"><span>🏟️ {sport.venue}, {sport.city}</span></div>
        <div className="bms-event-footer">
          <span className="bms-event-price">₹{sport.price?.min ?? 300} onwards</span>
          <button className="bms-btn-red bms-event-book-btn" onClick={onBook}>Book Now</button>
        </div>
      </div>
    </div>
  );
}

function PlayCard({ play, image, onBook }) {
  return (
    <div className="bms-event-card">
      <div className="bms-event-img-wrap">
        <img className="bms-event-img" src={image} alt={play.title}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/pl${play.id}/400/225`; }} />
        <span className="bms-event-cat-badge" style={{ background: '#8e44ad' }}>{play.genre}</span>
      </div>
      <div className="bms-event-info">
        <h3 className="bms-event-title">{play.title}</h3>
        <div className="bms-event-artist">by {play.director}</div>
        <div className="bms-event-meta"><span>📅 {play.date}</span><span>🌐 {play.language}</span></div>
        <div className="bms-event-meta"><span>📍 {play.venue}, {play.city}</span></div>
        <div className="bms-event-footer">
          <span className="bms-event-price">₹{play.price?.min ?? 400} onwards</span>
          <button className="bms-btn-red bms-event-book-btn" onClick={onBook}>Book Now</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility components
// ─────────────────────────────────────────────────────────────────────────────

function HScroll({ children }) {
  const ref = useRef(null);
  return (
    <div className="bms-hscroll-wrap">
      <div className="bms-hscroll" ref={ref}>{children}</div>
    </div>
  );
}

function HScrollSkeleton({ type = 'movie', count = 5 }) {
  return (
    <HScroll>
      {Array.from({ length: count }, (_, i) => (
        type === 'premiere'
          ? <div key={i} className="bms-premiere-card bms-skeleton"><div className="bms-skeleton-img" style={{ aspectRatio: '2/3', borderRadius: 10 }} /></div>
          : <SkeletonMovieCard key={i} />
      ))}
    </HScroll>
  );
}

function SkeletonMovieCard() {
  return (
    <div className="bms-skeleton bms-skeleton-movie" style={{ width: 180, flexShrink: 0 }}>
      <div className="bms-skeleton-img" style={{ aspectRatio: '2/3' }} />
      <div className="bms-skeleton-body">
        <div className="bms-skeleton-line long" />
        <div className="bms-skeleton-line medium" />
        <div className="bms-skeleton-line short" />
      </div>
    </div>
  );
}

function SkeletonEventCard() {
  return (
    <div className="bms-skeleton bms-skeleton-event">
      <div className="bms-skeleton-img" style={{ aspectRatio: '16/9' }} />
      <div className="bms-skeleton-body">
        <div className="bms-skeleton-line long" />
        <div className="bms-skeleton-line medium" />
        <div className="bms-skeleton-line short" />
      </div>
    </div>
  );
}

function FilterRow({ label, options, value, onChange }) {
  return (
    <div className="bms-filter-group">
      <span className="bms-filter-label">{label}</span>
      <div className="bms-scroll-row">
        {options.map((o) => (
          <button key={o} className={`bms-pill${value === o ? ' active' : ''}`} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ icon, msg, onRefresh }) {
  return (
    <div className="bms-empty">
      <span>{icon}</span>
      <p>{msg}</p>
      {onRefresh && <button className="bms-btn-red" onClick={onRefresh} style={{ marginTop: 12 }}>↺ Try Again</button>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StreamTab — full streaming content section
// ─────────────────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: 'netflix',  name: 'Netflix',        color: '#E50914', bg: '#141414', icon: 'N', tag: 'Trending Now' },
  { id: 'prime',    name: 'Prime Video',    color: '#00A8E0', bg: '#0F1F2E', icon: '▶', tag: 'New Releases' },
  { id: 'hotstar',  name: 'Disney+ Hotstar',color: '#1E88E5', bg: '#0C2461', icon: '★', tag: 'Live & Sports' },
  { id: 'sonyliv',  name: 'SonyLIV',        color: '#FF4444', bg: '#1A0A0A', icon: 'S', tag: 'Originals' },
  { id: 'zee5',     name: 'ZEE5',           color: '#7B2FBE', bg: '#1A0D26', icon: 'Z', tag: 'Hindi Content' },
  { id: 'jio',      name: 'JioCinema',      color: '#0052CC', bg: '#001433', icon: 'J', tag: 'Free Streaming' },
];

const STREAM_SHOWS = [
  { id: 1,  title: 'Heeramandi',         platform: 'Netflix',        genre: 'Drama',        lang: 'Hindi',   episodes: 8,  rating: 8.2, year: 2024, type: 'Series' },
  { id: 2,  title: 'Panchayat S3',       platform: 'Prime Video',    genre: 'Comedy Drama', lang: 'Hindi',   episodes: 8,  rating: 9.0, year: 2024, type: 'Series' },
  { id: 3,  title: 'Mirzapur S3',        platform: 'Prime Video',    genre: 'Crime Thriller',lang: 'Hindi',  episodes: 10, rating: 8.5, year: 2024, type: 'Series' },
  { id: 4,  title: 'The Family Man S3',  platform: 'Prime Video',    genre: 'Action Thriller',lang: 'Hindi', episodes: 9,  rating: 9.2, year: 2025, type: 'Series' },
  { id: 5,  title: 'Scam 2003',          platform: 'SonyLIV',        genre: 'Crime Drama',  lang: 'Hindi',   episodes: 10, rating: 8.8, year: 2024, type: 'Series' },
  { id: 6,  title: 'Citadel: Honey Bunny',platform: 'Prime Video',   genre: 'Action',       lang: 'Hindi',   episodes: 6,  rating: 7.9, year: 2024, type: 'Series' },
  { id: 7,  title: 'IC 814',             platform: 'Netflix',        genre: 'Thriller',     lang: 'Hindi',   episodes: 6,  rating: 8.4, year: 2024, type: 'Series' },
  { id: 8,  title: 'Kota Factory S3',    platform: 'Netflix',        genre: 'Drama',        lang: 'Hindi',   episodes: 6,  rating: 9.1, year: 2024, type: 'Series' },
  { id: 9,  title: 'Taaza Khabar S2',    platform: 'Disney+ Hotstar',genre: 'Comedy',       lang: 'Hindi',   episodes: 8,  rating: 8.0, year: 2024, type: 'Series' },
  { id: 10, title: 'Bandish Bandits S2', platform: 'Prime Video',    genre: 'Musical Drama',lang: 'Hindi',   episodes: 10, rating: 8.6, year: 2024, type: 'Series' },
  { id: 11, title: 'Gyaarah Gyaarah',    platform: 'ZEE5',           genre: 'Mystery',      lang: 'Hindi',   episodes: 8,  rating: 7.8, year: 2024, type: 'Series' },
  { id: 12, title: 'Dil Dosti Dilemma',  platform: 'Prime Video',    genre: 'Teen Drama',   lang: 'Hindi',   episodes: 9,  rating: 7.5, year: 2024, type: 'Series' },
];

const STREAM_MOVIES = [
  { id: 21, title: 'Fighter',          platform: 'Netflix',         genre: 'Action',    lang: 'Hindi',  rating: 7.2, year: 2024 },
  { id: 22, title: 'Article 370',      platform: 'ZEE5',            genre: 'Thriller',  lang: 'Hindi',  rating: 8.1, year: 2024 },
  { id: 23, title: 'Crew',             platform: 'Netflix',         genre: 'Comedy',    lang: 'Hindi',  rating: 7.4, year: 2024 },
  { id: 24, title: 'Shaitaan',         platform: 'JioCinema',       genre: 'Horror',    lang: 'Hindi',  rating: 7.8, year: 2024 },
  { id: 25, title: 'Maidaan',          platform: 'Prime Video',     genre: 'Sports',    lang: 'Hindi',  rating: 8.3, year: 2024 },
  { id: 26, title: 'Aavesham',         platform: 'Prime Video',     genre: 'Action Comedy',lang:'Malayalam', rating: 8.6, year: 2024 },
  { id: 27, title: 'Manjummel Boys',   platform: 'SonyLIV',         genre: 'Thriller',  lang: 'Malayalam', rating: 8.5, year: 2024 },
  { id: 28, title: 'Premalu',          platform: 'Prime Video',     genre: 'Romance',   lang: 'Malayalam', rating: 8.2, year: 2024 },
];

const PLATFORM_COLORS = {
  'Netflix': '#E50914', 'Prime Video': '#00A8E0',
  'Disney+ Hotstar': '#1E88E5', 'SonyLIV': '#FF4444',
  'ZEE5': '#7B2FBE', 'JioCinema': '#0052CC',
};

function StreamTab() {
  const [streamFilter, setStreamFilter] = useState('All');
  const [langFilter, setLangFilter] = useState('All');
  const streamLangs = ['All', 'Hindi', 'English', 'Malayalam', 'Tamil', 'Telugu'];

  const filteredShows = STREAM_SHOWS.filter(s =>
    (streamFilter === 'All' || s.platform === streamFilter) &&
    (langFilter === 'All' || s.lang === langFilter)
  );
  const filteredMovies = STREAM_MOVIES.filter(m =>
    (streamFilter === 'All' || m.platform === streamFilter) &&
    (langFilter === 'All' || m.lang === langFilter)
  );

  return (
    <div className="stream-tab">
      {/* Platform cards */}
      <section className="bms-section">
        <h2 className="bms-section-title">Streaming Platforms</h2>
        <div className="stream-platforms">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              className={`stream-platform-card${streamFilter === p.name ? ' active' : ''}`}
              style={{ '--p-color': p.color, '--p-bg': p.bg }}
              onClick={() => setStreamFilter(prev => prev === p.name ? 'All' : p.name)}
            >
              <div className="stream-p-icon" style={{ background: p.color }}>{p.icon}</div>
              <div className="stream-p-name">{p.name}</div>
              <div className="stream-p-tag">{p.tag}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Language filter */}
      <div className="bms-filter-row" style={{ marginBottom: 8 }}>
        <span className="bms-filter-label">Language:</span>
        <div className="bms-scroll-row">
          {streamLangs.map(l => (
            <button key={l} className={`bms-pill${langFilter === l ? ' active' : ''}`}
              onClick={() => setLangFilter(l)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Trending Series */}
      {filteredShows.length > 0 && (
        <section className="bms-section">
          <h2 className="bms-section-title">Trending Web Series</h2>
          <div className="stream-grid">
            {filteredShows.map(show => (
              <div key={show.id} className="stream-show-card">
                <div className="stream-show-thumb" style={{ backgroundImage: `url(https://picsum.photos/seed/ws${show.id}/320/180)` }}>
                  <div className="stream-show-overlay">
                    <span className="stream-platform-badge" style={{ background: PLATFORM_COLORS[show.platform] || '#333' }}>
                      {show.platform}
                    </span>
                    <span className="stream-type-badge">{show.episodes} Episodes</span>
                  </div>
                </div>
                <div className="stream-show-info">
                  <div className="stream-show-title">{show.title}</div>
                  <div className="stream-show-meta">
                    <span>⭐ {show.rating}</span>
                    <span>{show.genre}</span>
                    <span>{show.year}</span>
                  </div>
                  <div className="stream-show-lang">{show.lang}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New on Streaming — Movies */}
      {filteredMovies.length > 0 && (
        <section className="bms-section">
          <h2 className="bms-section-title">New on Streaming — Movies</h2>
          <div className="stream-grid">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="stream-show-card">
                <div className="stream-show-thumb" style={{ backgroundImage: `url(https://picsum.photos/seed/sm${movie.id}/320/180)` }}>
                  <div className="stream-show-overlay">
                    <span className="stream-platform-badge" style={{ background: PLATFORM_COLORS[movie.platform] || '#333' }}>
                      {movie.platform}
                    </span>
                    <span className="stream-type-badge">Movie</span>
                  </div>
                </div>
                <div className="stream-show-info">
                  <div className="stream-show-title">{movie.title}</div>
                  <div className="stream-show-meta">
                    <span>⭐ {movie.rating}</span>
                    <span>{movie.genre}</span>
                    <span>{movie.year}</span>
                  </div>
                  <div className="stream-show-lang">{movie.lang}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {filteredShows.length === 0 && filteredMovies.length === 0 && (
        <div className="bms-empty">
          <span>📺</span>
          <p>No content found for this filter. Try selecting a different platform or language.</p>
        </div>
      )}
    </div>
  );
}
