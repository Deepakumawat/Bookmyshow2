export const reviewsDatabase = {
  1: [ // Avatar reviews
    {
      id: 'rev_1',
      userId: 'user_1',
      userName: 'Amit Kumar',
      userImage: '👨‍💼',
      rating: 5,
      title: 'Mind-blowing experience!',
      text: 'Absolutely incredible visuals and storytelling. The underwater world is so immersive. Watched in IMAX and it was worth every penny!',
      images: [],
      helpfulVotes: 234,
      unhelpfulVotes: 12,
      status: 'approved',
      createdAt: new Date('2024-01-15'),
      verified: true,
    },
    {
      id: 'rev_2',
      userId: 'user_2',
      userName: 'Priya Singh',
      userImage: '👩‍💼',
      rating: 4,
      title: 'Great visuals, good story',
      text: 'The cinematography is stunning but the plot is a bit slow in the first half. Overall great entertainment for a weekend.',
      images: [],
      helpfulVotes: 156,
      unhelpfulVotes: 8,
      status: 'approved',
      createdAt: new Date('2024-01-14'),
      verified: true,
    },
    {
      id: 'rev_3',
      userId: 'user_3',
      userName: 'Rahul Patel',
      userImage: '👨',
      rating: 5,
      title: 'Best movie of the year!',
      text: 'I watched it twice and both times I was amazed. The 3D effects are incredible. Highly recommended!',
      images: [],
      helpfulVotes: 189,
      unhelpfulVotes: 5,
      status: 'approved',
      createdAt: new Date('2024-01-13'),
      verified: true,
    },
  ],
  2: [ // Oppenheimer reviews
    {
      id: 'rev_4',
      userId: 'user_4',
      userName: 'Neha Verma',
      userImage: '👩',
      rating: 5,
      title: 'A masterpiece!',
      text: 'Christopher Nolan has done it again. Brilliant direction, outstanding performances. A must-watch for cinema lovers.',
      images: [],
      helpfulVotes: 267,
      unhelpfulVotes: 10,
      status: 'approved',
      createdAt: new Date('2024-01-12'),
      verified: true,
    },
    {
      id: 'rev_5',
      userId: 'user_5',
      userName: 'Vikram Desai',
      userImage: '👨',
      rating: 4,
      title: 'Dense but rewarding',
      text: 'The movie is complex and demands attention. Cillian Murphy is fantastic. Worth the 3-hour runtime.',
      images: [],
      helpfulVotes: 145,
      unhelpfulVotes: 15,
      status: 'approved',
      createdAt: new Date('2024-01-11'),
      verified: true,
    },
  ],
  3: [ // Barbie reviews
    {
      id: 'rev_6',
      userId: 'user_6',
      userName: 'Anjali Sharma',
      userImage: '👩',
      rating: 4,
      title: 'Fun and entertaining!',
      text: 'Great fun movie with excellent performances. Margot Robbie and Ryan Gosling have amazing chemistry. Perfect for a fun outing!',
      images: [],
      helpfulVotes: 198,
      unhelpfulVotes: 20,
      status: 'approved',
      createdAt: new Date('2024-01-10'),
      verified: true,
    },
    {
      id: 'rev_7',
      userId: 'user_7',
      userName: 'Akshay Roy',
      userImage: '👨',
      rating: 5,
      title: 'Better than expected!',
      text: 'I wasn\'t sure about this movie but it\'s hilarious and stylish. A real crowd-pleaser!',
      images: [],
      helpfulVotes: 176,
      unhelpfulVotes: 12,
      status: 'approved',
      createdAt: new Date('2024-01-09'),
      verified: true,
    },
  ],
};

export const getReviewsByEventId = (eventId) => {
  return reviewsDatabase[eventId] || [];
};

export const getAverageRating = (eventId) => {
  const reviews = getReviewsByEventId(eventId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

export const getRatingDistribution = (eventId) => {
  const reviews = getReviewsByEventId(eventId);
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((review) => {
    distribution[review.rating]++;
  });

  return distribution;
};

export const getMostHelpfulReviews = (eventId, limit = 5) => {
  const reviews = getReviewsByEventId(eventId);
  return reviews
    .sort((a, b) => b.helpfulVotes - a.helpfulVotes)
    .slice(0, limit);
};

export const getRecentReviews = (eventId, limit = 5) => {
  const reviews = getReviewsByEventId(eventId);
  return reviews
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

export const addReview = (eventId, review) => {
  const newReview = {
    id: `rev_${Date.now()}`,
    createdAt: new Date(),
    helpfulVotes: 0,
    unhelpfulVotes: 0,
    status: 'pending',
    verified: false,
    images: [],
    ...review,
  };

  if (!reviewsDatabase[eventId]) {
    reviewsDatabase[eventId] = [];
  }

  reviewsDatabase[eventId].unshift(newReview);
  return newReview;
};
