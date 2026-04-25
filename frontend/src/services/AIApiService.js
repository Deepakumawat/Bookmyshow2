const BASE      = import.meta.env.VITE_API_BASE || '';
const AI_BASE   = `${BASE}/api/ai`;
const TMDB_BASE = `${BASE}/api/movies`;

class AIApiService {
  async _get(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API failed: ${res.status}`);
    return res.json();
  }

  async _post(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API failed: ${res.status}`);
    return res.json();
  }

  // ── Movies: TMDB real data, fallback to AI ─────────────────────────
  async getMovies() {
    try {
      const data = await this._get(`${TMDB_BASE}/now-playing`);
      if (data.movies?.length) return data.movies;
    } catch {}
    // Fallback to OpenAI-generated
    const data = await this._get(`${AI_BASE}/movies?lang=en&genre=all`);
    return data.movies || [];
  }

  async getComingSoon() {
    try {
      const data = await this._get(`${TMDB_BASE}/upcoming`);
      if (data.movies?.length) return data.movies;
    } catch {}
    const data = await this._get(`${AI_BASE}/coming-soon`);
    return data.movies || [];
  }

  async getMovieDetails(id) {
    try {
      return await this._get(`${TMDB_BASE}/${id}`);
    } catch {}
    return null;
  }

  // ── Events / Sports / Plays: AI generated ─────────────────────────
  async getEvents(city = 'Mumbai') {
    const data = await this._get(`${AI_BASE}/events?city=${encodeURIComponent(city)}`);
    return data.events || [];
  }

  async getSports() {
    const data = await this._get(`${AI_BASE}/sports`);
    return data.sports || [];
  }

  async getPlays(city = 'Mumbai') {
    const data = await this._get(`${AI_BASE}/plays?city=${encodeURIComponent(city)}`);
    return data.plays || [];
  }

  async getPremieres() {
    const data = await this._get(`${AI_BASE}/premieres`);
    return data.premieres || [];
  }

  async recommend(genres, languages) {
    const data = await this._post(`${AI_BASE}/recommend`, { genres, languages });
    return data.recommendations || [];
  }

  async search(query) {
    const data = await this._post(`${AI_BASE}/search`, { query });
    return data.results || [];
  }

  async clearCache() {
    return this._post(`${AI_BASE}/cache/clear`, {});
  }
}

export default new AIApiService();

// ── ML Service ────────────────────────────────────────────────────────────
const ML_BASE = `${BASE}/api/ml`;

const _mlGet  = (url) => fetch(url).then(r => r.json());
const _mlPost = (url, body) => fetch(url, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
}).then(r => r.json());

export const MLService = {
  collaborativeFilter: (userId = 1, limit = 6)   => _mlGet(`${ML_BASE}/collaborative-filter?userId=${userId}&limit=${limit}`),
  pricePredict:        (showId, seatType = 'GOLD') => _mlGet(`${ML_BASE}/price-predict?showId=${showId}&seatType=${seatType}`),
  urgency:             (showId)                    => _mlGet(`${ML_BASE}/urgency?showId=${showId}`),
  reviewIntelligence:  (movieTitle, reviews)       => _mlPost(`${ML_BASE}/review-intelligence`, { movieTitle, reviews }),
  bundle:              (genre, groupSize, showTime, seatType) => _mlPost(`${ML_BASE}/bundle`, { genre, groupSize, showTime, seatType }),
  churnScore:          (userId = 1)                => _mlGet(`${ML_BASE}/churn-score?userId=${userId}`),
  demandForecast:      (showId)                    => _mlGet(`${ML_BASE}/demand-forecast?showId=${showId}`),
  socialProof:         (showId)                    => _mlGet(`${ML_BASE}/social-proof?showId=${showId}`),
};
