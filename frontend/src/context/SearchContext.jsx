import React, { createContext, useContext, useState } from 'react';

export const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('movies');
  const [searchResults, setSearchResults] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  const updateFilters = (filters) => {
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const performSearch = (query, category = selectedCategory, filters = {}) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setActiveFilters(filters);
    setIsSearching(true);
    // Results will be set by AIService
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        searchResults,
        setSearchResults,
        activeFilters,
        updateFilters,
        clearFilters,
        performSearch,
        isSearching,
        setIsSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}
