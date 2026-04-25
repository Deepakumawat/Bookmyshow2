import { useState, useEffect } from 'react';
import { MLService } from '../../services/AIApiService';
import CollaborativeRecs from './CollaborativeRecs';

export default function MLDashboard() {
  const [churn, setChurn]     = useState(null);
  const [forecast, setForecast] = useState(null);
  const [activeTab, setActiveTab] = useState('recs');

  useEffect(() => {
    MLService.churnScore(1).then(setChurn).catch(() => {});
    MLService.demandForecast(1).then(setForecast).catch(() => {});
  }, []);

  const tabs = [
    { id: 'recs',     label: '🤖 Collaborative Filter' },
    { id: 'churn',    label: '📉 Churn Predictor' },
    { id: 'forecast', label: '📊 Demand Forecast' },
  ];

  return (
    <div style={styles.wrap}>
      <div style={styles.heading}>
        <span style={styles.headingBadge}>ML Engine</span>
        <h2 style={styles.headingTitle}>Advanced ML Intelligence Dashboard</h2>
        <p style={styles.headingSub}>Real ML algorithms running live on your BookMyShow data</p>
      </div>

      <div style={styles.tabs}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'recs' && (
        <div>
          <CollaborativeRecs userId={1} />
          <div style={styles.infoCard}>
            <h4 style={styles.infoTitle}>How it works</h4>
            <p style={styles.infoText}>
              Builds a <strong>user-genre preference vector</strong> from booking history,
              then computes <strong>cosine similarity</strong> between all users.
              Movies loved by similar users (but not yet seen by you) are ranked by match score.
              Pure Java ML — no OpenAI involved.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'churn' && churn && (
        <div style={styles.churnWrap}>
          <div style={styles.churnScore}>
            <svg viewBox="0 0 120 120" style={{ width: 140, height: 140 }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none"
                stroke={churn.riskLevel === 'HIGH' ? '#ef4444' : churn.riskLevel === 'MEDIUM' ? '#f97316' : '#22c55e'}
                strokeWidth="12"
                strokeDasharray={`${(churn.churnScore / 100) * 314} 314`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">{churn.churnScore}</text>
              <text x="60" y="72" textAnchor="middle" fontSize="10" fill="#64748b">Churn Score</text>
            </svg>
            <div style={styles.churnMeta}>
              <div style={{ ...styles.riskBadge,
                background: churn.riskLevel === 'HIGH' ? '#fef2f2' : churn.riskLevel === 'MEDIUM' ? '#fff7ed' : '#f0fdf4',
                color: churn.riskLevel === 'HIGH' ? '#ef4444' : churn.riskLevel === 'MEDIUM' ? '#f97316' : '#22c55e',
                border: `1.5px solid ${churn.riskLevel === 'HIGH' ? '#ef4444' : churn.riskLevel === 'MEDIUM' ? '#f97316' : '#22c55e'}`
              }}>
                {churn.riskLevel} RISK
              </div>
              <div style={styles.churnStat}>Total Bookings: <b>{churn.totalBookings}</b></div>
              <div style={styles.churnStat}>Days Since Last: <b>{churn.daysSinceLastBook}d</b></div>
              <div style={styles.churnStat}>Avg/Month: <b>{churn.avgMonthlyBookings}</b></div>
            </div>
          </div>

          <div style={styles.signalGrid}>
            {Object.entries(churn.signals).map(([k, v]) => (
              <div key={k} style={styles.signalCard}>
                <div style={styles.signalLabel}>{k.replace('Score','')}</div>
                <div style={styles.signalBar}>
                  <div style={{ width: `${v}%`, height: '100%', background: v > 70 ? '#ef4444' : v > 40 ? '#f97316' : '#22c55e', borderRadius: 99 }} />
                </div>
                <div style={styles.signalVal}>{v}</div>
              </div>
            ))}
          </div>

          {churn.retentionOffer && (
            <div style={styles.offerCard}>
              <div style={styles.offerTitle}>🎁 Auto-Generated Retention Offer</div>
              <div style={styles.offerText}>{churn.retentionOffer.title}</div>
              <div style={styles.offerCode}>Code: <b>{churn.retentionOffer.code}</b> · {churn.retentionOffer.discountPct}% off · Valid {churn.retentionOffer.validDays} days</div>
            </div>
          )}

          <div style={styles.infoCard}>
            <h4 style={styles.infoTitle}>RFM Algorithm</h4>
            <p style={styles.infoText}>
              Uses <strong>Recency (50%)</strong>, <strong>Frequency (30%)</strong>, <strong>Volume (20%)</strong>
              weighted scoring — the same model used by Amazon and Netflix for churn prediction.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'forecast' && forecast && (
        <div>
          <div style={styles.forecastHeader}>
            <div style={styles.forecastMovie}>{forecast.movie}</div>
            <div style={{ ...styles.popularityBadge,
              background: forecast.popularityScore > 75 ? '#fef2f2' : forecast.popularityScore > 55 ? '#fff7ed' : '#f0fdf4',
              color: forecast.popularityScore > 75 ? '#ef4444' : forecast.popularityScore > 55 ? '#f97316' : '#22c55e',
            }}>
              {forecast.popularityLabel} · Score {forecast.popularityScore}/100
            </div>
          </div>

          <div style={styles.forecastStats}>
            <ForecastStat label="Current Occupancy" value={`${forecast.currentOccupancy}%`} />
            <ForecastStat label="Seats Remaining"   value={forecast.seatsRemaining} />
            <ForecastStat label="Booking Velocity"  value={forecast.bookingVelocity} />
            <ForecastStat label="Peak Hour"         value={forecast.peakHour} />
          </div>

          <div style={styles.chartWrap}>
            <div style={styles.chartTitle}>Hourly Demand Forecast</div>
            <div style={styles.chartBars}>
              {forecast.hourlyForecast?.map((h, i) => {
                const maxT = Math.max(...forecast.hourlyForecast.map(x => x.predictedTickets));
                const barH = maxT > 0 ? Math.round((h.predictedTickets / maxT) * 80) + 10 : 10;
                const col  = h.trend === 'Hot' ? '#ef4444' : h.trend === 'Warm' ? '#f97316' : '#3b82f6';
                return (
                  <div key={i} style={styles.bar}>
                    <div style={styles.barLabel}>{h.predictedTickets} tickets</div>
                    <div style={{ ...styles.barFill, height: barH, background: col }} />
                    <div style={styles.barHour}>{h.hour}</div>
                    <div style={{ ...styles.barTrend, color: col }}>{h.trend}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.infoCard}>
            <h4 style={styles.infoTitle}>Multi-Signal Demand Forecaster</h4>
            <p style={styles.infoText}>
              Combines <strong>movie rating (30pts)</strong>, <strong>current occupancy (50pts)</strong>,
              and <strong>recency bonus (20pts)</strong> into a popularity score.
              Hourly forecasts use adaptive booking velocity based on current fill rate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ForecastStat({ label, value }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
    </div>
  );
}

const styles = {
  wrap:            { background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 18, padding: 24, marginBottom: 24 },
  heading:         { marginBottom: 20, textAlign: 'center' },
  headingBadge:    { background: '#ede9fe', color: '#7c3aed', borderRadius: 20, padding: '3px 14px', fontSize: '0.75rem', fontWeight: 700 },
  headingTitle:    { margin: '8px 0 4px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' },
  headingSub:      { margin: 0, fontSize: '0.82rem', color: '#64748b' },
  tabs:            { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  tab:             { padding: '8px 16px', borderRadius: 20, border: '1.5px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#475569' },
  tabActive:       { background: '#7c3aed', color: '#fff', border: '1.5px solid #7c3aed' },
  infoCard:        { background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 10, padding: '12px 16px', marginTop: 16 },
  infoTitle:       { margin: '0 0 6px', fontSize: '0.82rem', fontWeight: 700, color: '#5b21b6' },
  infoText:        { margin: 0, fontSize: '0.78rem', color: '#4c1d95', lineHeight: 1.6 },
  churnWrap:       { display: 'flex', flexDirection: 'column', gap: 16 },
  churnScore:      { display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' },
  churnMeta:       { display: 'flex', flexDirection: 'column', gap: 8 },
  riskBadge:       { padding: '4px 14px', borderRadius: 20, fontWeight: 800, fontSize: '0.85rem', display: 'inline-block' },
  churnStat:       { fontSize: '0.82rem', color: '#475569' },
  signalGrid:      { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  signalCard:      { background: '#f8fafc', borderRadius: 10, padding: '10px 14px' },
  signalLabel:     { fontSize: '0.72rem', color: '#64748b', marginBottom: 6, textTransform: 'capitalize' },
  signalBar:       { height: 8, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden', marginBottom: 4 },
  signalVal:       { fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' },
  offerCard:       { background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 12, padding: '14px 16px' },
  offerTitle:      { fontWeight: 700, fontSize: '0.85rem', color: '#14532d', marginBottom: 4 },
  offerText:       { fontSize: '0.88rem', color: '#166534', fontWeight: 600, marginBottom: 4 },
  offerCode:       { fontSize: '0.75rem', color: '#15803d' },
  forecastHeader:  { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' },
  forecastMovie:   { fontWeight: 800, fontSize: '1rem', color: '#0f172a', flex: 1 },
  popularityBadge: { padding: '4px 14px', borderRadius: 20, fontWeight: 700, fontSize: '0.82rem' },
  forecastStats:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 },
  chartWrap:       { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 },
  chartTitle:      { fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginBottom: 12 },
  chartBars:       { display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 },
  bar:             { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 },
  barLabel:        { fontSize: '0.6rem', color: '#64748b', textAlign: 'center' },
  barFill:         { width: '100%', borderRadius: '4px 4px 0 0', minHeight: 10 },
  barHour:         { fontSize: '0.65rem', fontWeight: 700, color: '#475569' },
  barTrend:        { fontSize: '0.6rem', fontWeight: 600 },
};
