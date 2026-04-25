import React from 'react';
import { useCategory } from '../context/CategoryContext';
import { useTheme } from '../context/ThemeContext';

function CategorySelector() {
  const { selectedCategory, selectCategory, availableCategories } = useCategory();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 24,
        padding: '20px',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(57,154,255,0.05)',
        borderRadius: 12,
        border: `1px solid var(--border)`,
      }}
    >
      {availableCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => selectCategory(category.id)}
          style={{
            padding: '12px 16px',
            background:
              selectedCategory === category.id
                ? category.color
                : isDark
                ? '#253549'
                : '#f0f6ff',
            border: `2px solid ${selectedCategory === category.id ? category.color : 'var(--border)'}`,
            color: selectedCategory === category.id ? 'white' : 'var(--text-primary)',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== category.id) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: 18 }}>{category.emoji}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}

export default CategorySelector;
