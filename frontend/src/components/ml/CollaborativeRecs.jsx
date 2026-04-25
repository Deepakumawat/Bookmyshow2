import { useState, useEffect } from 'react';
import { MLService } from '../../services/AIApiService';

export default function CollaborativeRecs({ userId = 1 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MLService.collaborativeFilter(userId, 6)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div style={styles.loader}>Loading recommendations...</div>;
  if (!data?.recommendations?.length) return null;

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.badge}>🤖 ML</span>
        <span style={styles.title}>Users Like You Also Loved</span>
        <span style={styles.algo}>{data.algorithm}</span>
      </div>
      <div style={styles.grid}>
        {data.recommendations.map((m) => (
          <div key={m.movieId} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.movieTitle}>{m.title}</div>
              <div style={styles.matchBadge}>{m.matchScore}% match</div>
            </div>
            <div style={styles.genre}>{m.genre} · {m.language}</div>
            <div style={styles.rating}>⭐ {m.rating}</div>
            <div style={styles.reason}>{m.reason}</div>
            <div style={styles.matchBar}>
              <div style={{ ...styles.matchFill, width: `${m.matchScore}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div style={styles.footer}>
        Powered by cosine-similarity collaborative filtering · {data.genreDimensions} genre dimensions
      </div>
    </div>
  );
}

const styles = {
  wrap:       { background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 20, marginBottom: 24 },
  header:     { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  badge:      { background: '#ede9fe', color: '#7c3aed', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 },
  title:      { fontWeight: 700, fontSize: '1rem', color: '#0f172a', flex: 1 },
  algo:       { fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 },
  card:       { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 },
  cardTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, marginBottom: 4 },
  movieTitle: { fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', flex: 1 },
  matchBadge: { background: '#7c3aed', color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' },
  genre:      { fontSize: '0.72rem', color: '#64748b', marginBottom: 4 },
  rating:     { fontSize: '0.78rem', fontWeight: 600, color: '#d97706', marginBottom: 4 },
  reason:     { fontSize: '0.72rem', color: '#475569', lineHeight: 1.4, marginBottom: 6 },
  matchBar:   { height: 4, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' },
  matchFill:  { height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a855f7)', borderRadius: 99 },
  loader:     { padding: 16, color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' },
  footer:     { marginTop: 12, fontSize: '0.68rem', color: '#94a3b8', textAlign: 'center', fontFamily: 'monospace' },
};
