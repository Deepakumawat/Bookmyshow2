import { useState, useEffect } from 'react';
import { MLService } from '../../services/AIApiService';

export default function UrgencyWidget({ showId }) {
  const [data, setData] = useState(null);
  const [social, setSocial] = useState(null);

  useEffect(() => {
    if (!showId) return;
    const load = () => Promise.all([
      MLService.urgency(showId),
      MLService.socialProof(showId),
    ]).then(([u, s]) => { setData(u); setSocial(s); }).catch(() => {});
    load();
    const t = setInterval(load, 15000); // refresh every 15s
    return () => clearInterval(t);
  }, [showId]);

  if (!data) return null;

  const colorMap = { HIGH: '#ef4444', MEDIUM: '#f97316', LOW: '#22c55e' };
  const bgMap    = { HIGH: '#fef2f2', MEDIUM: '#fff7ed', LOW: '#f0fdf4' };
  const color    = colorMap[data.urgencyLevel] || '#22c55e';
  const bg       = bgMap[data.urgencyLevel]    || '#f0fdf4';

  return (
    <div style={{ background: bg, border: `1.5px solid ${color}`, borderRadius: 12, padding: '12px 16px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{data.urgencyEmoji || '✅'}</span>
        <span style={{ fontWeight: 700, color, fontSize: '0.9rem' }}>
          {data.urgencyMessage}
        </span>
        <span style={{
          marginLeft: 'auto', background: color, color: '#fff',
          borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700
        }}>
          {data.urgencyLevel}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Stat label="Seats Left"   value={data.seatsAvailable} icon="💺" />
        <Stat label="Viewing Now"  value={`${data.viewersNow} people`} icon="👁" />
        <Stat label="Occupancy"    value={`${data.occupancyPct}%`} icon="📊" />
        {data.estimatedSelloutHours > 0 && data.estimatedSelloutHours < 10 &&
          <Stat label="Sells out in" value={`~${data.estimatedSelloutHours}h`} icon="⏱" />}
      </div>

      {social?.signals?.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {social.signals.map((s, i) => (
            <span key={i} style={{
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', color: '#475569'
            }}>
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#374151' }}>
      <span>{icon}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
      <span style={{ color: '#6b7280' }}>{label}</span>
    </div>
  );
}
