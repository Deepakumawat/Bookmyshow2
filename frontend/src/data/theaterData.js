export const theaters = [
  {
    id: 't1',
    name: 'PVR Cinemas Downtown',
    city: 'Mumbai',
    lat: 19.0760,
    lng: 72.8777,
    chain: 'PVR',
    rating: 4.5,
    reviews: 1200,
    amenities: ['WiFi', 'Parking', 'Food Court', 'Wheelchair Access', 'Premium Seats'],
    operatingHours: '9:00 AM - 11:00 PM',
    contact: '+91-22-1234-5678',
    address: 'Downtown Shopping Mall, Mumbai',
  },
  {
    id: 't2',
    name: 'INOX Leisure',
    city: 'Delhi',
    lat: 28.5244,
    lng: 77.1855,
    chain: 'INOX',
    rating: 4.3,
    reviews: 980,
    amenities: ['WiFi', 'Parking', 'Cafe', 'Wheelchair Access', 'IMAX Screens'],
    operatingHours: '10:00 AM - 11:00 PM',
    contact: '+91-11-1234-5678',
    address: 'Connaught Place, Delhi',
  },
  {
    id: 't3',
    name: 'Carnival Cinemas',
    city: 'Bangalore',
    lat: 12.9716,
    lng: 77.5946,
    chain: 'Carnival',
    rating: 4.2,
    reviews: 750,
    amenities: ['WiFi', 'Parking', 'Food Court', 'Kids Zone', '4DX Screens'],
    operatingHours: '10:00 AM - 10:30 PM',
    contact: '+91-80-1234-5678',
    address: 'Forum Mall, Bangalore',
  },
  {
    id: 't4',
    name: 'Cinepolis Premium',
    city: 'Hyderabad',
    lat: 17.3850,
    lng: 78.4867,
    chain: 'Cinepolis',
    rating: 4.6,
    reviews: 890,
    amenities: ['WiFi', 'Free Parking', 'Gourmet Food', 'Wheelchair Access', 'VIP Lounges'],
    operatingHours: '9:00 AM - 11:00 PM',
    contact: '+91-40-1234-5678',
    address: 'Cyber Hub, Hyderabad',
  },
];

export const getTheaterById = (id) => {
  return theaters.find((t) => t.id === id);
};

export const getTheatersByCity = (city) => {
  return theaters.filter((t) => t.city.toLowerCase() === city.toLowerCase());
};

export const amenityIcons = {
  WiFi: '📶',
  Parking: '🅿️',
  'Food Court': '🍴',
  Cafe: '☕',
  'Wheelchair Access': '♿',
  'Premium Seats': '👑',
  'IMAX Screens': '📽️',
  'Kids Zone': '🎠',
  '4DX Screens': '🎬',
  'Gourmet Food': '🍽️',
  'VIP Lounges': '✨',
  'Free Parking': '🅿️',
};
