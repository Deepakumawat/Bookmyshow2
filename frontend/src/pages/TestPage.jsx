import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function TestPage() {
  const { isDark } = useContext(ThemeContext);

  return (
    <div style={{
      background: isDark ? '#0F0F0F' : '#fff',
      color: isDark ? '#fff' : '#000',
      padding: '40px',
      minHeight: '100vh',
      fontFamily: 'system-ui'
    }}>
      <h1>✅ BookMyShow is Loading!</h1>
      <p>If you see this page, React is working correctly.</p>
      <p>Theme: {isDark ? '🌙 Dark' : '☀️ Light'}</p>

      <h2>Quick Links:</h2>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/theatres">Theatres</a></li>
        <li><a href="/offers">Offers</a></li>
      </ul>

      <hr />
      <h3>Troubleshooting:</h3>
      <p>If you see a blank page:</p>
      <ol>
        <li>Open browser console (F12)</li>
        <li>Look for red errors</li>
        <li>Take a screenshot of the error</li>
      </ol>

      <button onClick={() => window.location.reload()} style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        background: '#E41B32',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}>
        Reload Page
      </button>
    </div>
  );
}
