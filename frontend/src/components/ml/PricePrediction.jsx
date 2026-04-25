import { useState, useEffect } from 'react';
import { MLService } from '../../services/AIApiService';

export default function PricePrediction({ showId, seatType = 'GOLD' }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!showId) return;
    MLService.pricePredict(showId, seatType).then(setData).catch(() => {});
  }, [showId, seatType]);

  if (!data) return null;

  const buyNowColor = data.buyNow ? '#ef4444' : '#3b82f6';

  return (
    <div style={{
      background: '#f8faff', border: '1.5px solid #c7d7f8',
      borderRadius: 12, padding: '14px 16px', marginBottom: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>📈</span>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e3a5f' }}>Price Prediction</span>
        {data.buyNow && (
          <span style={{
            marginLeft: 'auto', background: '#ef4444', color: '#fff',
            borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700
          }}>
            BUY NOW
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Current Price</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>₹{data.currentPrice}</div>
        </div>
        {data.currentSurge > 1 && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: 8, padding: '4px 10px', fontSize: '0.8rem', color: '#ef4444', fontWeight: 700
          }}>
            {Math.round((data.currentSurge - 1) * 100)}% surge active
          </div>
        )}
        <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#64748b' }}>
          Base: ₹{data.basePrice} · {data.bookingVelocity}
        </div>
      </div>

      <div style={{ fontSize: '0.82rem', color: buyNowColor, fontWeight: 600, marginBottom: 10 }}>
        {data.advice}
      </div>

      {/* Price forecast bars */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60 }}>
        {data.forecast?.map((f, i) => {
          const maxP = Math.max(...data.forecast.map(x => x.predictedPrice));
          const h = Math.round((f.predictedPrice / maxP) * 48) + 12;
          const isHigher = f.predictedPrice > data.currentPrice;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ fontSize: '0.65rem', color: isHigher ? '#ef4444' : '#22c55e', fontWeight: 700 }}>
                ₹{f.predictedPrice}
              </div>
              <div style={{
                width: '100%', height: h,
                background: isHigher ? '#fee2e2' : '#dcfce7',
                border: `1.5px solid ${isHigher ? '#ef4444' : '#22c55e'}`,
                borderRadius: 4
              }} />
              <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>+{f.hoursFromNow}h</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
