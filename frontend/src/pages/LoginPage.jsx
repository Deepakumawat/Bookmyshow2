import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/bms-theme.css';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      await AuthService.login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bauth-bg">
      <div className="bauth-card">
        {/* Logo */}
        <div className="bauth-logo" onClick={() => navigate('/')}>
          book<span>my</span>show
        </div>

        <h1 className="bauth-title">Welcome back!</h1>
        <p className="bauth-sub">Sign in to continue booking your favourite shows</p>

        {error && <div className="bauth-error">⚠️ {error}</div>}

        <form className="bauth-form" onSubmit={handleSubmit}>
          <div className="bauth-field">
            <label className="bauth-label">Email</label>
            <input
              className="bauth-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="bauth-field">
            <label className="bauth-label">Password</label>
            <input
              className="bauth-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button className="bms-btn-red bauth-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="bauth-divider"><span>or</span></div>

        <div className="bauth-social-row">
          <button className="bauth-social-btn" onClick={() => alert('Google login coming soon!')} type="button">🔵 Continue with Google</button>
          <button className="bauth-social-btn" onClick={() => alert('Mobile OTP coming soon!')} type="button">📱 Continue with Mobile</button>
        </div>

        <p className="bauth-switch">
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} className="bauth-link">Sign Up</span>
        </p>
      </div>
    </div>
  );
}
