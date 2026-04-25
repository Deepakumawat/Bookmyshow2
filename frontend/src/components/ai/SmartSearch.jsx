import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AIService from '../../services/AIService';

export function SmartSearch({ onResults }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isDark = theme === 'dark';

  // Sample NLP suggestions based on user input
  const getNLPSuggestions = (input) => {
    const suggestions = [
      "🎬 Find action movies in Mumbai this Friday",
      "🎭 Show me comedy movies with highest ratings",
      "🌟 Trending movies in my area",
      "⏰ Movies playing now near me",
      "🎪 IMAX shows available today",
      "👥 Movies good for family with kids",
      "💰 Budget-friendly shows under $10"
    ];
    return suggestions.filter(s =>
      s.toLowerCase().includes(input.toLowerCase()) || input.length === 0
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      setSuggestions(getNLPSuggestions(value));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      console.log('[SmartSearch] Processing NL query:', searchQuery);
      const result = await AIService.processNLSearch(searchQuery);
      console.log('[SmartSearch] Result:', result);
      onResults?.(result);
      setShowSuggestions(false);
      setQuery('');
    } catch (error) {
      console.error('[SmartSearch] Error:', error);
      // Fallback: show mock results
      onResults?.({
        movies: [
          { id: 1, title: 'Mock Movie 1', genre: 'Action' },
          { id: 2, title: 'Mock Movie 2', genre: 'Drama' }
        ],
        error: 'Using mock data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cleanQuery = suggestion.replace(/^[🎬🎭🌟⏰🎪👥💰]\s/, '');
    setQuery(cleanQuery);
    handleSearch(cleanQuery);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: '100%',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        gap: 8,
        position: 'relative'
      }}>
        <input
          type="text"
          placeholder="Try: 'Find action movies near me this Friday' 🎬"
          value={query}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 8,
            border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
            background: isDark ? '#253549' : '#f8fafc',
            color: isDark ? '#e2e8f0' : '#1e293b',
            fontSize: 14,
            transition: 'all 0.2s',
            outline: 'none'
          }}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: '#E41B32',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '🔍 Searching...' : '🔍 Search'}
        </button>
      </div>

      {/* AI Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          background: isDark ? '#1a2332' : 'white',
          border: `1px solid ${isDark ? '#334155' : '#ddeaff'}`,
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(57,154,255,0.1)',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 120,
          zIndex: 10,
          maxHeight: 300,
          overflowY: 'auto',
          marginTop: 8
        }}>
          <div style={{ padding: 8 }}>
            <p style={{
              margin: '8px 12px 8px 12px',
              fontSize: 12,
              color: isDark ? '#94a3b8' : '#64748b',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              ✨ AI Suggestions
            </p>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: idx < suggestions.length - 1 ? `1px solid ${isDark ? '#334155' : '#ddeaff'}` : 'none',
                  color: isDark ? '#cbd5e1' : '#475569',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  fontSize: 13
                }}
                onMouseOver={(e) => e.target.style.background = isDark ? '#253549' : '#f0f6ff'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <p style={{
        fontSize: 12,
        color: isDark ? '#94a3b8' : '#64748b',
        margin: 0,
        textAlign: 'center'
      }}>
        💡 Try natural language queries. AI will understand your preferences!
      </p>
    </div>
  );
}

export default SmartSearch;
