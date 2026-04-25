export const heroBanners = [
  {
    id: 1,
    title: 'Avatar: The Way of Water',
    subtitle: 'Experience the magic underwater',
    description: 'Journey to the breathtaking world of Pandora in this epic adventure.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&h=600&fit=crop',
    cta: 'Book Tickets',
    ctaLink: '/event/1',
    rating: 4.8,
    genre: ['Sci-Fi', 'Adventure'],
    year: 2022,
  },
  {
    id: 2,
    title: 'Oppenheimer',
    subtitle: 'The story that changed the world',
    description: 'An epic biographical drama about J. Robert Oppenheimer and the Manhattan Project.',
    image: 'https://images.unsplash.com/photo-1533613220915-609f24a17fd9?w=1200&h=600&fit=crop',
    cta: 'Book Tickets',
    ctaLink: '/event/2',
    rating: 4.7,
    genre: ['Biography', 'Drama'],
    year: 2023,
  },
  {
    id: 3,
    title: 'Barbie',
    subtitle: 'Life in the Dreamhouse',
    description: 'Barbie comes to life in this colorful, fun-filled adventure.',
    image: 'https://images.unsplash.com/photo-1489599849228-ed4dc59b2c84?w=1200&h=600&fit=crop',
    cta: 'Book Tickets',
    ctaLink: '/event/3',
    rating: 4.5,
    genre: ['Comedy', 'Fantasy'],
    year: 2023,
  },
  {
    id: 4,
    title: 'Killers of the Flower Moon',
    subtitle: 'A dark tale of greed and crime',
    description: 'An epic Western crime thriller directed by Martin Scorsese.',
    image: 'https://images.unsplash.com/photo-1594909122845-11bced63c160?w=1200&h=600&fit=crop',
    cta: 'Book Tickets',
    ctaLink: '/event/4',
    rating: 4.6,
    genre: ['Crime', 'Drama'],
    year: 2023,
  },
  {
    id: 5,
    title: 'The Marvels',
    subtitle: 'New heroes, new powers, new universe',
    description: 'Marvel characters join forces to save the universe from darkness.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c6e4a9396?w=1200&h=600&fit=crop',
    cta: 'Book Tickets',
    ctaLink: '/event/5',
    rating: 4.3,
    genre: ['Action', 'Superhero'],
    year: 2023,
  },
];

export const getHeroBannerById = (id) => {
  return heroBanners.find((banner) => banner.id === id);
};

export const getRandomHeroBanners = (count = 5) => {
  const shuffled = [...heroBanners].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
