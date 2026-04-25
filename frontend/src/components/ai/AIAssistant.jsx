import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AIService from '../../services/AIService';

export function AIAssistant() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: '👋 Hi! I\'m your AI booking assistant. I can help you find movies, check availability, and complete your booking. What would you like to do?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const isDark = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call AI agent
      console.log('[AIAssistant] Sending message:', input);
      const response = await AIService.startAIAgent(input, {
        preferences: { genre: 'action', language: 'english' },
        bookingHistory: []
      });

      // Add assistant response
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        text: response.message || 'I\'m processing your request. Please wait a moment.',
        actions: response.actions || [],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Execute suggested actions if any
      if (response.actions && response.actions.length > 0) {
        console.log('[AIAssistant] Available actions:', response.actions);
      }
    } catch (error) {
      console.error('[AIAssistant] Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'assistant',
        text: '🤖 I encountered an issue processing your request. Here are some things I can help with:\n\n• Find movies by genre or location\n• Check showtimes and availability\n• Get personalized recommendations\n• Complete your booking\n\nWhat interests you?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E41B32, #C81426)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(228, 27, 50, 0.3)',
          transition: 'all 0.2s',
          zIndex: 99
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        💬
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      width: 400,
      height: 600,
      borderRadius: 12,
      background: isDark ? '#1a2332' : 'white',
      border: `1px solid ${isDark ? '#334155' : '#ddeaff'}`,
      boxShadow: `0 8px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(57,154,255,0.2)'}`,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'all 0.3s'
    }}>
      {/* Header */}
      <div style={{
        padding: 16,
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>🤖 AI Assistant</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, opacity: 0.9 }}>Powered by Claude</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: 20,
            cursor: 'pointer',
            padding: 0
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: isDark ? '#0f172a' : '#f8fafc'
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: 12,
              background: msg.type === 'user'
                ? '#E41B32'
                : isDark ? '#253549' : '#f0f6ff',
              color: msg.type === 'user'
                ? 'white'
                : isDark ? '#e2e8f0' : '#1e293b',
              fontSize: 13,
              lineHeight: 1.5,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{
            display: 'flex',
            gap: 8,
            padding: '12px 16px',
            background: isDark ? '#253549' : '#f0f6ff',
            borderRadius: 12,
            width: 'fit-content'
          }}>
            <span style={{
              display: 'inline-block',
              animation: 'pulse 1s infinite',
              color: '#E41B32',
              fontSize: 14
            }}>
              ●
            </span>
            <span style={{
              display: 'inline-block',
              animation: 'pulse 1s 0.2s infinite',
              color: '#E41B32',
              fontSize: 14
            }}>
              ●
            </span>
            <span style={{
              display: 'inline-block',
              animation: 'pulse 1s 0.4s infinite',
              color: '#E41B32',
              fontSize: 14
            }}>
              ●
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: 12,
        borderTop: `1px solid ${isDark ? '#334155' : '#ddeaff'}`,
        display: 'flex',
        gap: 8
      }}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
            borderRadius: 6,
            background: isDark ? '#253549' : '#f8fafc',
            color: isDark ? '#e2e8f0' : '#1e293b',
            fontSize: 13,
            outline: 'none',
            transition: 'all 0.2s'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 16px',
            background: '#E41B32',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s'
          }}
        >
          Send
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default AIAssistant;
