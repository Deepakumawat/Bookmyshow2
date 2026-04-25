import { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { UserContext } from '../context/UserContext';
import AuthService from '../services/AuthService';
import '../styles/bms-theme.css';
import './LoginPage.css';

const API = import.meta.env.VITE_API_BASE || '';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { updateUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mobile login state
  const [showMobile, setShowMobile] = useState(false);
  const [phone, setPhone] = useState('');
  const [mobileName, setMobileName] = useState('');
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileError, setMobileError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      await AuthService.login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        const { name, email: gEmail } = profile;

        // Try login first, then register if not found
        let userData;
        try {
          const loginRes = await fetch(`${API}/api/mongo/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: gEmail }),
          });
          userData = await loginRes.json();
          if (!loginRes.ok) throw new Error('not found');
        } catch {
          const regRes = await fetch(`${API}/api/mongo/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email: gEmail, city: 'Mumbai' }),
          });
          userData = await regRes.json();
        }

        updateUser({ id: userData.id, name: userData.name, email: userData.email, isLoggedIn: true, city: userData.city });
        navigate(redirect);
      } catch (err) {
        setError('Google login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google login was cancelled or failed.'),
  });

  // Mobile phone login
  const handleMobileLogin = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) { setMobileError('Enter a valid 10-digit phone number.'); return; }
    setMobileLoading(true); setMobileError('');
    const pseudoEmail = `${phone.replace(/\D/g, '')}@mobile.bms`;
    try {
      let userData;
      try {
        const loginRes = await fetch(`${API}/api/mongo/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: pseudoEmail }),
        });
        userData = await loginRes.json();
        if (!loginRes.ok) throw new Error('not found');
      } catch {
        const regRes = await fetch(`${API}/api/mongo/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: mobileName.trim() || `User ${phone.slice(-4)}`, email: pseudoEmail, city: 'Mumbai' }),
        });
        userData = await regRes.json();
      }
      updateUser({ id: userData.id, name: userData.name, email: userData.email, isLoggedIn: true });
      navigate(redirect);
    } catch {
      setMobileError('Login failed. Please try again.');
    } finally {
      setMobileLoading(false);
    }
  };

  return (
    <div className="bauth-bg">
      <div className="bauth-card">
        <div className="bauth-logo" onClick={() => navigate('/')}>book<span>my</span>show</div>
        <h1 className="bauth-title">Welcome back!</h1>
        <p className="bauth-sub">Sign in to continue booking your favourite shows</p>

        {error && <div className="bauth-error">⚠️ {error}</div>}

        {!showMobile ? (
          <>
            <form className="bauth-form" onSubmit={handleSubmit}>
              <div className="bauth-field">
                <label className="bauth-label">Email</label>
                <input className="bauth-input" type="email" placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="bauth-field">
                <label className="bauth-label">Password</label>
                <input className="bauth-input" type="password" placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              </div>
              <button className="bms-btn-red bauth-submit-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="bauth-divider"><span>or</span></div>

            <div className="bauth-social-row">
              <button className="bauth-social-btn" type="button" onClick={() => googleLogin()} disabled={loading}>
                🔵 Continue with Google
              </button>
              <button className="bauth-social-btn" type="button" onClick={() => setShowMobile(true)}>
                📱 Continue with Mobile
              </button>
            </div>
          </>
        ) : (
          <>
            <form className="bauth-form" onSubmit={handleMobileLogin}>
              <div className="bauth-field">
                <label className="bauth-label">Your Name</label>
                <input className="bauth-input" type="text" placeholder="Enter your name"
                  value={mobileName} onChange={(e) => setMobileName(e.target.value)} autoComplete="name" />
              </div>
              <div className="bauth-field">
                <label className="bauth-label">Mobile Number</label>
                <input className="bauth-input" type="tel" placeholder="+91 Enter your mobile number"
                  value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" maxLength={13} />
              </div>
              {mobileError && <div className="bauth-error">⚠️ {mobileError}</div>}
              <button className="bms-btn-red bauth-submit-btn" type="submit" disabled={mobileLoading}>
                {mobileLoading ? 'Verifying...' : 'Continue'}
              </button>
              <button className="bauth-social-btn" type="button" onClick={() => setShowMobile(false)} style={{marginTop:'8px'}}>
                ← Back to Email Login
              </button>
            </form>
          </>
        )}

        <p className="bauth-switch">
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} className="bauth-link">Sign Up</span>
        </p>
      </div>
    </div>
  );
}
