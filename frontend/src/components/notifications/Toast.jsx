import React, { useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';

export function Toast() {
  const { toastMessage } = useNotification();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: isDark ? '#1a1a2e' : 'white',
        border: '1px solid var(--border)',
        borderLeft: '4px solid var(--primary)',
        borderRadius: 8,
        padding: '16px 20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: 400,
        zIndex: 9999,
        animation: 'slideInUp 0.3s ease',
      }}
    >
      <span style={{ fontSize: 20 }}>{toastMessage.icon}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
        {toastMessage.message}
      </span>
      <style>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
