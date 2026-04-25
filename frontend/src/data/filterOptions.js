export const filterOptions = {
  movies: {
    genre: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Romance', 'Animation'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi'],
    rating: ['U', 'UA', 'A', 'S'],
    year: [2024, 2023, 2022, 2021, 2020],
    director: ['Christopher Nolan', 'Sukumar', 'S.S. Rajamouli', 'Greta Gerwig', 'Steven Spielberg'],
  },
  events: {
    eventType: ['Concert', 'Comedy', 'Festival', 'Expo', 'Conference'],
    genre: ['Music', 'Stand-up', 'Rock', 'Pop', 'Jazz', 'EDM'],
    ticketPrice: ['Under ₹1000', '₹1000-₹3000', '₹3000-₹5000', '₹5000+'],
    ageRestriction: ['All Ages', '13+', '16+', '18+'],
  },
  plays: {
    genre: ['Drama', 'Comedy', 'Tragedy', 'Contemporary'],
    language: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    duration: ['< 2 hours', '2-2.5 hours', '> 2.5 hours'],
    rating: ['4+', '3+', '2+', '1+'],
  },
  sports: {
    sport: ['Cricket', 'Football', 'Badminton', 'Tennis', 'Hockey'],
    league: ['IPL', 'T20 World Cup', 'International', 'Domestic'],
    team: ['Mumbai Indians', 'Chennai Super Kings', 'India', 'Australia'],
    ticketPrice: ['Under ₹500', '₹500-₹1000', '₹1000-₹2000', '₹2000+'],
  },
  streaming: {
    genre: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Documentary'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    releaseYear: [2024, 2023, 2022, 2021, 2020],
    rating: ['8+', '7+', '6+', '5+'],
  },
};

export const getFilterOptions = (category) => {
  return filterOptions[category] || {};
};
