import { useState, useEffect } from 'react';
import { MLService } from '../../services/AIApiService';

export default function SmartBundle({ genre = 'Action', groupSize = 2, showTime = 'evening', seatType = 'GOLD' }) {
  const [data, setData] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    MLService.bundle(genre, groupSize, showTime, seatType).then(setData).catch(() => {});
  }, [genre, groupSize, showTime, seatType]);

  if (!data) return null;

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.badge}>🎁 AI Bundle</span>
        <span style={styles.title}>{data.bundleName}</span>
        <span style={styles.save}>Save ₹{data.savings}</span>
      </div>

      <div style={styles.items}>
        {data.items.map((item, i) => (
          <div key={i} style={styles.item}>
            <span style={styles.emoji}>{item.emoji}</span>
            <div style={styles.itemInfo}>
              <div style={styles.itemName}>{item.name}</div>
              <div style={styles.itemMeta}>{item.category} · qty {item.quantity}</div>
            </div>
            <div style={styles.itemPrice}>₹{item.price}</div>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.priceRow}>
          <span style={styles.originalPrice}>₹{data.originalPrice}</span>
          <span style={styles.bundlePrice}>₹{data.bundlePrice}</span>
          <span style={styles.discountTag}>{data.discountPct}% off</span>
        </div>
        <button
          onClick={() => setAdded(true)}
          style={{ ...styles.btn, background: added ? '#22c55e' : '#f84464' }}
        >
          {added ? '✓ Added to Booking' : 'Add Bundle to Booking'}
        </button>
      </div>
      <div style={styles.algo}>Powered by genre-time-group rule engine</div>
    </div>
  );
}

const styles = {
  wrap:          { background: '#fff8f0', border: '1.5px solid #fed7aa', borderRadius: 14, padding: 16, marginBottom: 16 },
  header:        { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  badge:         { background: '#fff', border: '1px solid #fed7aa', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#ea580c' },
  title:         { fontWeight: 700, fontSize: '0.88rem', color: '#431407', flex: 1 },
  save:          { background: '#22c55e', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 },
  items:         { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 },
  item:          { display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 8, padding: '8px 12px' },
  emoji:         { fontSize: 20 },
  itemInfo:      { flex: 1 },
  itemName:      { fontWeight: 600, fontSize: '0.85rem', color: '#1c1917' },
  itemMeta:      { fontSize: '0.72rem', color: '#78716c' },
  itemPrice:     { fontWeight: 700, fontSize: '0.88rem', color: '#1c1917' },
  footer:        { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  priceRow:      { display: 'flex', alignItems: 'center', gap: 8 },
  originalPrice: { fontSize: '0.85rem', color: '#9ca3af', textDecoration: 'line-through' },
  bundlePrice:   { fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' },
  discountTag:   { background: '#dcfce7', color: '#16a34a', borderRadius: 20, padding: '1px 8px', fontSize: '0.72rem', fontWeight: 700 },
  btn:           { marginLeft: 'auto', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' },
  algo:          { marginTop: 8, fontSize: '0.65rem', color: '#c4b5a5', fontFamily: 'monospace', textAlign: 'right' },
};
