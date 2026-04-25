import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { useTheme } from '../../context/ThemeContext';

function FilterPanel() {
  const { activeFilters, filterOptions, addFilter, removeFilter, clearAllFilters } = useFilter();
  const { theme } = useTheme();
  const [expandedFilter, setExpandedFilter] = useState(null);

  const isDark = theme === 'dark';

  const toggleFilterGroup = (filterName) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  if (Object.keys(filterOptions).length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: isDark ? '#1a2332' : '#f8fafc',
        border: `1px solid var(--border)`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Filters</h3>
        {Object.keys(activeFilters).length > 0 && (
          <button
            onClick={clearAllFilters}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              padding: 0,
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {Object.entries(filterOptions).map(([filterName, options]) => (
        <div key={filterName} style={{ marginBottom: 12 }}>
          <button
            onClick={() => toggleFilterGroup(filterName)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: '8px 0',
              textAlign: 'left',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: 13,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ textTransform: 'capitalize' }}>{filterName}</span>
            <span style={{ fontSize: 12 }}>{expandedFilter === filterName ? '▼' : '▶'}</span>
          </button>

          {expandedFilter === filterName && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingLeft: 8,
                paddingTop: 8,
                borderLeft: `2px solid var(--primary)`,
                marginLeft: 0,
              }}
            >
              {Array.isArray(options) &&
                options.map((option) => (
                  <label
                    key={option}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: 13,
                      gap: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        (activeFilters[filterName] || []).includes(option) ||
                        false
                      }
                      onChange={() => addFilter(filterName, option)}
                      style={{
                        cursor: 'pointer',
                        width: 16,
                        height: 16,
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
            </div>
          )}
        </div>
      ))}

      {Object.keys(activeFilters).length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid var(--border)` }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Active Filters:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(activeFilters).map(([filterName, values]) =>
              Array.isArray(values)
                ? values.map((value) => (
                    <span
                      key={`${filterName}-${value}`}
                      style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {value}
                    </span>
                  ))
                : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
