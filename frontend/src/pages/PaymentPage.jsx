import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BmsHeader from '../components/layout/BmsHeader';
import { UserContext } from '../context/UserContext';
import '../styles/bms-theme.css';
import './PaymentPage.css';

// Resolve logged-in user from either auth system
function getLoggedInUser(contextUser) {
  if (contextUser?.isLoggedIn && contextUser.email && !contextUser.email.includes('guest@')) {
    return contextUser;
  }
  // Fallback: email/password login stored by AuthService
  try {
    const saved = localStorage.getItem('user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u?.email) return { email: u.email, name: u.name || u.email, id: u.id || '', isLoggedIn: true };
    }
  } catch (_) {}
  return null;
}

const API = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : window.location.origin;

const UPI_APPS = [
  { id: 'gpay',     label: 'Google Pay',  icon: '🔵', color: '#4285F4' },
  { id: 'phonepe',  label: 'PhonePe',     icon: '🟣', color: '#5F259F' },
  { id: 'paytm',    label: 'Paytm',       icon: '🔷', color: '#00B9F1' },
  { id: 'bhim',     label: 'BHIM UPI',    icon: '🇮🇳', color: '#138808' },
  { id: 'amazon',   label: 'Amazon Pay',  icon: '🟡', color: '#FF9900' },
];

const BANKS = [
  'HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda', 'Yes Bank',
];

const WALLETS = [
  { id: 'paytm',   label: 'Paytm Wallet',  icon: '💙', balance: '₹2,340' },
  { id: 'phonepe', label: 'PhonePe Wallet', icon: '💜', balance: '₹580' },
  { id: 'amazon',  label: 'Amazon Pay',     icon: '🟡', balance: '₹1,200' },
  { id: 'mobikwik',label: 'MobiKwik',       icon: '🔵', balance: '₹450' },
];

export default function PaymentPage() {
  const navigate   = useNavigate();
  const { state }  = useLocation();
  const { user }   = useContext(UserContext);

  const [tab,        setTab]        = useState('upi');
  const [upiApp,     setUpiApp]     = useState(null);
  const [upiId,      setUpiId]      = useState('');
  const [cardNum,    setCardNum]    = useState('');
  const [cardName,   setCardName]   = useState('');
  const [cardExp,    setCardExp]    = useState('');
  const [cardCvv,    setCardCvv]    = useState('');
  const [bank,       setBank]       = useState('');
  const [wallet,     setWallet]     = useState(null);
  const [processing, setProcessing] = useState(false);
  const [step,       setStep]       = useState(''); // 'verifying' | 'processing' | 'done'

  if (!state) {
    return (
      <div className="bms-home">
        <BmsHeader />
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ fontSize: 48 }}>🎟️</div>
          <h2 style={{ color: 'var(--bms-text)', margin: '16px 0 8px' }}>No booking found</h2>
          <button className="bms-btn-red" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  // Works for both movie seats flow and event/sports flow
  const movieTitle  = state.movieTitle  || state.title  || 'Show';
  const venue       = state.theatreName || state.venue   || '';
  const city        = state.city        || user?.city    || 'Mumbai';
  const time        = state.showTime    || state.time    || '';
  const grandTotal  = state.grandTotal  || state.totalAmount || 0;
  const seats       = state.seats       || [];
  const seatTier    = state.tier        || '';
  const qty         = state.qty         || seats.length || 1;

  const isPayReady = () => {
    if (tab === 'upi')     return upiApp || upiId.includes('@');
    if (tab === 'card')    return cardNum.replace(/\s/g, '').length === 16 && cardExp && cardCvv.length >= 3;
    if (tab === 'netbank') return !!bank;
    if (tab === 'wallet')  return !!wallet;
    return false;
  };

  const handlePay = () => {
    if (!isPayReady()) return;
    setProcessing(true);
    setStep('verifying');
    setTimeout(() => setStep('processing'), 1200);
    setTimeout(async () => {
      setStep('done');
      const bookingId = 'BMS' + Math.floor(Math.random() * 9000000 + 1000000);
      const paymentLabel = tab === 'upi' ? (upiApp ? UPI_APPS.find(u => u.id === upiApp)?.label : upiId) : tab;
      const booking = {
        bookingId,
        title: movieTitle,
        venue,
        time,
        seats,
        seatTier,
        qty,
        total: grandTotal,
        date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        bookedAt: new Date().toISOString(),
        paymentMethod: paymentLabel,
        type: state.type || 'movie',
      };

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('bms_bookings') || '[]');
      existing.unshift(booking);
      localStorage.setItem('bms_bookings', JSON.stringify(existing));

      // Navigate immediately — don't block on backend
      navigate('/confirmation', { state: { booking } });

      // Save to backend in background (fire and forget)
      const loggedInUser = getLoggedInUser(user);
      if (loggedInUser) {
        fetch(`${API}/api/mongo/tickets/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId:         loggedInUser.id || '',
            userEmail:      loggedInUser.email,
            userName:       loggedInUser.name || 'Guest',
            movieTitle,
            theatreName:    venue,
            city,
            showDate:       booking.date,
            showTime:       time,
            format:         state.showFormat || '2D',
            seats,
            seatType:       seatTier || 'GOLD',
            baseAmount:     state.ticketsTotal || grandTotal,
            convenienceFee: state.convenience || 0,
            paymentMethod:  paymentLabel,
          }),
        }).catch(e => console.error('Backend booking save failed:', e));
      }
    }, 2800);
  };

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExp  = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

  return (
    <div className="bms-home">
      <BmsHeader />

      {/* Processing overlay */}
      {processing && (
        <div className="pay-overlay">
          <div className="pay-overlay-card">
            {step !== 'done' ? (
              <>
                <div className="pay-spinner" />
                <div className="pay-overlay-title">
                  {step === 'verifying' ? 'Verifying payment…' : 'Processing transaction…'}
                </div>
                <div className="pay-overlay-sub">Please do not press back or refresh</div>
              </>
            ) : (
              <>
                <div className="pay-success-icon">✓</div>
                <div className="pay-overlay-title">Payment Successful!</div>
                <div className="pay-overlay-sub">Generating your e-ticket…</div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="pay-header">
        <div className="bms-container pay-header-inner">
          <button className="bst-back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <div className="pay-title">Complete Payment</div>
            <div className="pay-sub">{movieTitle}{venue ? ` • ${venue}` : ''}</div>
          </div>
        </div>
      </div>

      <div className="bms-container pay-body">
        <div className="pay-layout">

          {/* ── Left: Payment Methods ── */}
          <div className="pay-left">
            {/* Tab bar */}
            <div className="pay-tabs">
              {[['upi', '📱 UPI'], ['card', '💳 Card'], ['netbank', '🏦 Net Banking'], ['wallet', '👛 Wallet']].map(([id, label]) => (
                <button
                  key={id}
                  className={`pay-tab${tab === id ? ' active' : ''}`}
                  onClick={() => setTab(id)}
                >{label}</button>
              ))}
            </div>

            {/* UPI */}
            {tab === 'upi' && (
              <div className="pay-panel">
                <p className="pay-panel-label">Select UPI app</p>
                <div className="pay-upi-apps">
                  {UPI_APPS.map(app => (
                    <button
                      key={app.id}
                      className={`pay-upi-btn${upiApp === app.id ? ' active' : ''}`}
                      style={upiApp === app.id ? { borderColor: app.color, background: app.color + '18' } : {}}
                      onClick={() => { setUpiApp(app.id); setUpiId(''); }}
                    >
                      <span className="pay-upi-icon">{app.icon}</span>
                      <span className="pay-upi-label">{app.label}</span>
                    </button>
                  ))}
                </div>
                <div className="pay-divider"><span>or enter UPI ID</span></div>
                <input
                  className="pay-input"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => { setUpiId(e.target.value); setUpiApp(null); }}
                />
              </div>
            )}

            {/* Card */}
            {tab === 'card' && (
              <div className="pay-panel">
                <div className="pay-card-preview">
                  <div className="pay-card-chip">💳</div>
                  <div className="pay-card-num-display">{cardNum || '•••• •••• •••• ••••'}</div>
                  <div className="pay-card-bottom">
                    <span>{cardName || 'CARD HOLDER'}</span>
                    <span>{cardExp || 'MM/YY'}</span>
                  </div>
                </div>
                <div className="pay-fields">
                  <div className="pay-field-group">
                    <label className="pay-label">Card Number</label>
                    <input className="pay-input" placeholder="1234 5678 9012 3456"
                      value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} maxLength={19} />
                  </div>
                  <div className="pay-field-group">
                    <label className="pay-label">Card Holder Name</label>
                    <input className="pay-input" placeholder="As on card"
                      value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} />
                  </div>
                  <div className="pay-row-fields">
                    <div className="pay-field-group">
                      <label className="pay-label">Expiry</label>
                      <input className="pay-input" placeholder="MM/YY"
                        value={cardExp} onChange={e => setCardExp(formatExp(e.target.value))} maxLength={5} />
                    </div>
                    <div className="pay-field-group">
                      <label className="pay-label">CVV</label>
                      <input className="pay-input" placeholder="•••" type="password"
                        value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking */}
            {tab === 'netbank' && (
              <div className="pay-panel">
                <p className="pay-panel-label">Select your bank</p>
                <div className="pay-banks">
                  {BANKS.map(b => (
                    <button
                      key={b}
                      className={`pay-bank-btn${bank === b ? ' active' : ''}`}
                      onClick={() => setBank(b)}
                    >
                      🏦 {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet */}
            {tab === 'wallet' && (
              <div className="pay-panel">
                <p className="pay-panel-label">Select wallet</p>
                <div className="pay-wallets">
                  {WALLETS.map(w => (
                    <button
                      key={w.id}
                      className={`pay-wallet-btn${wallet?.id === w.id ? ' active' : ''}`}
                      onClick={() => setWallet(w)}
                    >
                      <span className="pay-wallet-icon">{w.icon}</span>
                      <div className="pay-wallet-info">
                        <span className="pay-wallet-name">{w.label}</span>
                        <span className="pay-wallet-bal">Balance: {w.balance}</span>
                      </div>
                      {wallet?.id === w.id && <span className="pay-wallet-check">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="pay-right">
            <div className="pay-summary-card">
              <h3 className="pay-summary-title">Order Summary</h3>

              <div className="pay-summary-movie">
                <div className="pay-summary-name">{movieTitle}</div>
                {venue && <div className="pay-summary-meta">📍 {venue}</div>}
                {time  && <div className="pay-summary-meta">⏰ {time}</div>}
                {seats.length > 0 && (
                  <div className="pay-summary-meta">🪑 {seats.join(', ')}</div>
                )}
                {seatTier && <div className="pay-summary-meta">🏷️ {seatTier}</div>}
              </div>

              <div className="pay-summary-rows">
                {state.ticketsTotal != null && (
                  <div className="pay-summary-row">
                    <span>Tickets ({seats.length || qty}×)</span>
                    <span>₹{state.ticketsTotal?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {state.convenience != null && (
                  <div className="pay-summary-row">
                    <span>Convenience Fee</span>
                    <span>₹{state.convenience?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pay-summary-row total">
                  <span>Total Payable</span>
                  <span>₹{grandTotal?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                className={`pay-btn${isPayReady() ? ' ready' : ''}`}
                onClick={handlePay}
                disabled={!isPayReady() || processing}
              >
                {processing ? '⏳ Processing…' : `Pay ₹${grandTotal?.toLocaleString('en-IN')}`}
              </button>

              <div className="pay-secure">
                <span>🔒</span>
                <span>256-bit SSL secured &nbsp;•&nbsp; 100% safe</span>
              </div>

              <div className="pay-methods-icons">
                <span title="Visa">VISA</span>
                <span title="Mastercard">MC</span>
                <span title="RuPay">RuPay</span>
                <span title="UPI">UPI</span>
                <span title="Paytm">Paytm</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
