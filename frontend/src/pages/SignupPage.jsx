import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/bms-theme.css';
import './LoginPage.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      await AuthService.signup(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bauth-bg">
      <div className="bauth-card">
        <div className="bauth-logo" onClick={() => navigate('/')}>book<span>my</span>show</div>
        <h1 className="bauth-title">Create Account</h1>
        <p className="bauth-sub">Join millions of entertainment lovers on BookMyShow</p>

        {error && <div className="bauth-error">⚠️ {error}</div>}

        <form className="bauth-form" onSubmit={handleSubmit}>
          <div className="bauth-field">
            <label className="bauth-label">Full Name</label>
            <input className="bauth-input" type="text" placeholder="Enter your full name" value={form.name} onChange={set('name')} />
          </div>
          <div className="bauth-field">
            <label className="bauth-label">Email</label>
            <input className="bauth-input" type="email" placeholder="Enter your email" value={form.email} onChange={set('email')} />
          </div>
          <div className="bauth-field">
            <label className="bauth-label">Password</label>
            <input className="bauth-input" type="password" placeholder="Create a password (min 6 chars)" value={form.password} onChange={set('password')} />
          </div>
          <div className="bauth-field">
            <label className="bauth-label">Confirm Password</label>
            <input className="bauth-input" type="password" placeholder="Re-enter your password" value={form.confirm} onChange={set('confirm')} />
          </div>
          <button className="bms-btn-red bauth-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="bauth-switch">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="bauth-link">Sign In</span>
        </p>
      </div>
    </div>
  );
}
