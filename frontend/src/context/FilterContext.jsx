import React, { createContext, useContext, useState } from 'react';
import { getFilterOptions } from '../data/filterOptions';

export const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [activeFilters, setActiveFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});

  const setFiltersForCategory = (category) => {
    const options = getFilterOptions(category);
    setFilterOptions(options);
    setActiveFilters({});
  };

  const addFilter = (filterName, value) => {
    setActiveFilters((prev) => {
      if (Array.isArray(value)) {
        return { ...prev, [filterName]: value };
      } else {
        const existing = prev[filterName] || [];
        return {
          ...prev,
          [filterName]: existing.includes(value)
            ? existing.filter((v) => v !== value)
            : [...existing, value],
        };
      }
    });
  };

  const removeFilter = (filterName, value) => {
    setActiveFilters((prev) => {
      const existing = prev[filterName] || [];
      return {
        ...prev,
        [filterName]: existing.filter((v) => v !== value),
      };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const updateFilterRange = (filterName, min, max) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: { min, max },
    }));
  };

  return (
    <FilterContext.Provider
      value={{
        activeFilters,
        filterOptions,
        setFiltersForCategory,
        addFilter,
        removeFilter,
        clearAllFilters,
        updateFilterRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within FilterProvider');
  }
  return context;
}
