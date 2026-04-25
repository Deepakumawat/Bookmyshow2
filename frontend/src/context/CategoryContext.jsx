import React, { createContext, useContext, useState } from 'react';
import { eventCategories } from '../data/eventCategories';

export const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState('movies');
  const [availableCategories] = useState(Object.values(eventCategories));

  const selectCategory = (categoryId) => {
    if (eventCategories[categoryId.toUpperCase()]) {
      setSelectedCategory(categoryId.toLowerCase());
      return true;
    }
    return false;
  };

  const getCategory = (categoryId = selectedCategory) => {
    return eventCategories[categoryId.toUpperCase()];
  };

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectCategory,
        availableCategories,
        getCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within CategoryProvider');
  }
  return context;
}
