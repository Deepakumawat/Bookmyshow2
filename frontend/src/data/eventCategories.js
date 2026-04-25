export const eventCategories = {
  MOVIES: {
    id: 'movies',
    label: 'Movies',
    emoji: '🎬',
    color: '#06b6d4',
    description: 'Latest films and blockbusters',
    filters: ['genre', 'language', 'rating', 'year', 'director'],
  },
  EVENTS: {
    id: 'events',
    label: 'Events',
    emoji: '🎪',
    color: '#f59e0b',
    description: 'Concerts, festivals, and live events',
    filters: ['eventType', 'genre', 'ticketPrice', 'ageRestriction'],
  },
  PLAYS: {
    id: 'plays',
    label: 'Plays',
    emoji: '🎭',
    color: '#8b5cf6',
    description: 'Theater productions and performances',
    filters: ['genre', 'language', 'duration', 'rating'],
  },
  SPORTS: {
    id: 'sports',
    label: 'Sports',
    emoji: '⚽',
    color: '#ef4444',
    description: 'Cricket, football, and other sports',
    filters: ['sport', 'league', 'team', 'ticketPrice'],
  },
  STREAMING: {
    id: 'streaming',
    label: 'Streaming',
    emoji: '📺',
    color: '#10b981',
    description: 'Movies and shows to rent or buy',
    filters: ['genre', 'language', 'releaseYear', 'rating'],
  },
};

export const getCategoryById = (id) => {
  return Object.values(eventCategories).find((cat) => cat.id === id);
};

export const getAllCategories = () => {
  return Object.values(eventCategories);
};
