import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BmsHeader from '../components/layout/BmsHeader';
import '../styles/bms-theme.css';
import './ShowTimingsPage.css';

const CITY_THEATRES = {
  'Jaipur': [
    { id: 1, name: 'PVR INOX World of Wonder', address: 'World of Wonder Mall, Jaipur', rating: 4.5, amenities: ['Dolby Atmos', 'IMAX', '4K', 'Recliners'] },
    { id: 2, name: 'Cinépolis Jaipur', address: 'Triton Mall, Malviya Nagar', rating: 4.3, amenities: ['Dolby', '3D', 'Lounge'] },
    { id: 3, name: 'PVR INOX Pink City Square', address: 'Pink City Square, C-Scheme', rating: 4.2, amenities: ['3D', 'Food Court'] },
    { id: 4, name: 'SRS Cinemas Crystal Palm', address: 'Crystal Palm Mall, Jaipur', rating: 4.0, amenities: ['2D', '3D'] },
    { id: 5, name: 'Miraj Cinemas Gaurav Tower', address: 'Gaurav Tower, M.I. Road', rating: 3.9, amenities: ['2D', '3D'] },
  ],
  'Mumbai': [
    { id: 1, name: 'PVR ICON Juhu', address: 'Mehboob Studios, Juhu', rating: 4.7, amenities: ['Dolby Atmos', 'IMAX', '4K', 'Recliners'] },
    { id: 2, name: 'INOX R City Mall', address: 'R City Mall, Ghatkopar', rating: 4.4, amenities: ['Dolby', '3D', 'Lounge'] },
    { id: 3, name: 'Cinépolis Viviana', address: 'Viviana Mall, Thane', rating: 4.2, amenities: ['3D', 'Food Court'] },
    { id: 4, name: 'PVR Andheri InOrbit', address: 'InOrbit Mall, Malad', rating: 4.3, amenities: ['Dolby', '3D'] },
    { id: 5, name: 'Carnival Cinemas Bandra', address: 'Linking Road, Bandra', rating: 4.0, amenities: ['2D', '3D'] },
  ],
  'Delhi': [
    { id: 1, name: 'PVR Select Citywalk', address: 'Select Citywalk Mall, Saket', rating: 4.6, amenities: ['Dolby Atmos', 'IMAX', '4DX', 'Recliners'] },
    { id: 2, name: 'INOX Nehru Place', address: 'Ansal Plaza, Nehru Place', rating: 4.3, amenities: ['Dolby', '3D', 'Lounge'] },
    { id: 3, name: 'Cinépolis DLF Promenade', address: 'DLF Promenade, Vasant Kunj', rating: 4.4, amenities: ['3D', 'Dolby'] },
    { id: 4, name: 'PVR Ambience Gurugram', address: 'Ambience Mall, Gurugram', rating: 4.5, amenities: ['IMAX', 'Dolby', 'Recliners'] },
    { id: 5, name: 'INOX Janakpuri', address: 'Janakpuri District Centre', rating: 4.0, amenities: ['2D', '3D'] },
  ],
  'Bangalore': [
    { id: 1, name: 'PVR Orion Mall', address: 'Orion Mall, Rajajinagar', rating: 4.5, amenities: ['Dolby Atmos', 'IMAX', 'Recliners'] },
    { id: 2, name: 'INOX Garuda Mall', address: 'Garuda Mall, Magrath Road', rating: 4.3, amenities: ['Dolby', '3D', 'Lounge'] },
    { id: 3, name: 'Cinépolis NEXUS', address: 'Nexus Mall, Koramangala', rating: 4.2, amenities: ['3D', 'Food Court'] },
    { id: 4, name: 'PVR Phoenix Marketcity', address: 'Phoenix Marketcity, Whitefield', rating: 4.4, amenities: ['Dolby', '4DX', '3D'] },
    { id: 5, name: 'INOX Lido Mall', address: 'Lido Mall, Ulsoor', rating: 4.1, amenities: ['2D', '3D'] },
  ],
  'Hyderabad': [
    { id: 1, name: 'PVR IMAX Inorbit', address: 'Inorbit Mall, Madhapur', rating: 4.6, amenities: ['Dolby Atmos', 'IMAX', 'Recliners'] },
    { id: 2, name: 'Cinépolis Manjeera', address: 'Manjeera Mall, Kukatpally', rating: 4.3, amenities: ['Dolby', '3D', 'Lounge'] },
    { id: 3, name: 'INOX GVK One', address: 'GVK One Mall, Banjara Hills', rating: 4.4, amenities: ['3D', 'Food Court'] },
    { id: 4, name: 'AMB Cinemas', address: 'Narsingi, Hyderabad', rating: 4.5, amenities: ['IMAX', 'Dolby', 'Recliners'] },
    { id: 5, name: 'PVR Forum Sujana', address: 'Forum Sujana Mall, Kukatpally', rating: 4.1, amenities: ['2D', '3D'] },
  ],
  'Chennai': [
    { id: 1, name: 'PVR VR Chennai', address: 'VR Mall, Anna Nagar', rating: 4.5, amenities: ['Dolby Atmos', 'IMAX', 'Recliners'] },
    { id: 2, name: 'Cinépolis Express Avenue', address: 'Express Avenue Mall, Royapettah', rating: 4.3, amenities: ['Dolby', '3D', 'Lounge'] },
    { id: 3, name: 'AGS Cinemas Velachery', address: 'Velachery Main Road', rating: 4.2, amenities: ['3D', 'Food Court'] },
    { id: 4, name: 'PVR Ampa Skywalk', address: 'Ampa Skywalk, Aminjikarai', rating: 4.1, amenities: ['2D', '3D'] },
    { id: 5, name: 'INOX Chennai', address: 'Sathyam Cinemas, Anna Salai', rating: 4.3, amenities: ['2D', '3D', 'Dolby'] },
  ],
  'Pune': [
    { id: 1, name: 'PVR INOX Amanora', address: 'Amanora Mall, Hadapsar', rating: 4.4, amenities: ['Dolby Atmos', 'IMAX', 'Recliners'] },
    { id: 2, name: 'Cinépolis Phoenix Marketcity', address: 'Phoenix Marketcity, Viman Nagar', rating: 4.3, amenities: ['Dolby', '3D'] },
    { id: 3, name: 'INOX Baner', address: 'Westend Mall, Baner', rating: 4.1, amenities: ['3D', 'Food Court'] },
    { id: 4, name: 'E-Square Cinemas', address: 'University Road, Pune', rating: 4.0, amenities: ['2D', '3D', 'Dolby'] },
    { id: 5, name: 'Cinépolis Pavilion', address: 'Pavilion Mall, Pune', rating: 3.9, amenities: ['2D', '3D'] },
  ],
  'Ahmedabad': [
    { id: 1, name: 'PVR INOX Alpha One', address: 'Alpha One Mall, Vastrapur', rating: 4.4, amenities: ['Dolby Atmos', 'IMAX', 'Recliners'] },
    { id: 2, name: 'Cinépolis Himalaya', address: 'Himalaya Mall, Drive-in Road', rating: 4.2, amenities: ['Dolby', '3D'] },
    { id: 3, name: 'INOX Seasons Mall', address: 'Seasons Mall, Prahlad Nagar', rating: 4.1, amenities: ['3D', 'Food Court'] },
    { id: 4, name: 'PVR Acropolis', address: 'Acropolis Mall, Ahmedabad', rating: 4.0, amenities: ['2D', '3D'] },
    { id: 5, name: 'Miraj Cinemas CG Road', address: 'C.G. Road, Ahmedabad', rating: 3.8, amenities: ['2D', '3D'] },
  ],
};

const SHOW_TEMPLATES = [
  [
    { time: '09:30 AM', price: 250, format: '2D', seatsLeft: 48 },
    { time: '12:30 PM', price: 300, format: '3D', seatsLeft: 23 },
    { time: '03:30 PM', price: 380, format: 'IMAX', seatsLeft: 8 },
    { time: '06:30 PM', price: 420, format: 'IMAX', seatsLeft: 4 },
    { time: '09:30 PM', price: 340, format: '3D', seatsLeft: 31 },
  ],
  [
    { time: '10:00 AM', price: 220, format: '2D', seatsLeft: 55 },
    { time: '01:00 PM', price: 260, format: '3D', seatsLeft: 17 },
    { time: '04:00 PM', price: 300, format: '3D', seatsLeft: 9 },
    { time: '07:00 PM', price: 330, format: '2D', seatsLeft: 40 },
    { time: '10:00 PM', price: 280, format: '2D', seatsLeft: 62 },
  ],
  [
    { time: '10:30 AM', price: 200, format: '2D', seatsLeft: 38 },
    { time: '01:30 PM', price: 240, format: '2D', seatsLeft: 14 },
    { time: '04:30 PM', price: 270, format: '3D', seatsLeft: 6 },
    { time: '07:30 PM', price: 300, format: '2D', seatsLeft: 28 },
    { time: '10:30 PM', price: 250, format: '2D', seatsLeft: 45 },
  ],
  [
    { time: '11:00 AM', price: 190, format: '2D', seatsLeft: 60 },
    { time: '02:00 PM', price: 220, format: '2D', seatsLeft: 25 },
    { time: '05:00 PM', price: 260, format: '3D', seatsLeft: 11 },
    { time: '08:00 PM', price: 290, format: '2D', seatsLeft: 34 },
  ],
  [
    { time: '10:45 AM', price: 180, format: '2D', seatsLeft: 52 },
    { time: '02:15 PM', price: 210, format: '2D', seatsLeft: 19 },
    { time: '06:00 PM', price: 250, format: '2D', seatsLeft: 7 },
    { time: '09:15 PM', price: 230, format: '2D', seatsLeft: 43 },
  ],
];

function getTheatresForCity(city) {
  if (CITY_THEATRES[city]) return CITY_THEATRES[city];
  const chains = [
    { prefix: 'PVR INOX', suffix: ' City Mall', amenities: ['Dolby Atmos', 'IMAX', 'Recliners'], rating: 4.5 },
    { prefix: 'Cinépolis', suffix: ' Grand', amenities: ['Dolby', '3D', 'Lounge'], rating: 4.3 },
    { prefix: 'INOX Multiplex', suffix: '', amenities: ['3D', 'Food Court'], rating: 4.1 },
    { prefix: 'PVR Cinemas', suffix: ' Centre', amenities: ['2D', '3D', 'Dolby'], rating: 4.2 },
    { prefix: 'Miraj Cinemas', suffix: '', amenities: ['2D', '3D'], rating: 3.9 },
  ];
  return chains.map(({ prefix, suffix, amenities, rating }, i) => ({
    id: i + 1,
    name: `${prefix} ${city}${suffix}`,
    address: `${city}`,
    rating,
    amenities,
  }));
}

export default function ShowTimingsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movieTitle = searchParams.get('movieTitle') || 'Movie';
  const movieId = searchParams.get('movieId') || '1';

  const [selectedDate, setSelectedDate] = useState(0);
  const [filters, setFilters] = useState({ format: 'All' });
  const city = localStorage.getItem('bms_city') || 'Jaipur';

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const theatres = getTheatresForCity(city).map((t, idx) => ({
    ...t,
    shows: SHOW_TEMPLATES[idx % SHOW_TEMPLATES.length].map((s, si) => ({
      ...s,
      id: `${t.id}-${si}`,
      showId: `show-${t.id}-${si}-${selectedDate}`,
    })),
  }));

  const filteredTheatres = theatres.map(t => ({
    ...t,
    shows: t.shows.filter(s => filters.format === 'All' || s.format === filters.format),
  })).filter(t => t.shows.length > 0);

  return (
    <div className="bms-home">
      <BmsHeader />

      <div className="bst-header">
        <div className="bms-container bst-header-inner">
          <button className="bst-back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div className="bst-movie-info">
            <h1 className="bst-movie-title">{movieTitle}</h1>
            <div className="bst-meta">
              <span>📍 {city}</span>
              <span className="bst-dot">•</span>
              <span>{dates[selectedDate].toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bst-date-bar">
        <div className="bms-container bst-dates">
          {dates.map((d, i) => (
            <button
              key={i}
              className={`bst-date-btn${selectedDate === i ? ' active' : ''}`}
              onClick={() => setSelectedDate(i)}
            >
              <span className="bst-date-day">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
              <span className="bst-date-num">{d.getDate()}</span>
              <span className="bst-date-mon">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bst-filter-bar">
        <div className="bms-container bst-filter-inner">
          <span className="bst-filter-label">Format:</span>
          {['All', '2D', '3D', 'IMAX'].map(f => (
            <button
              key={f}
              className={`bms-pill${filters.format === f ? ' active' : ''}`}
              onClick={() => setFilters(p => ({ ...p, format: f }))}
            >{f}</button>
          ))}
        </div>
      </div>

      <div className="bms-container bst-body">
        {filteredTheatres.map(theatre => (
          <TheatreShowRow
            key={theatre.id}
            theatre={theatre}
            onSelect={show =>
              navigate(`/seats?showId=${show.showId}&theatreId=${theatre.id}&theatreName=${encodeURIComponent(theatre.name)}&movieTitle=${encodeURIComponent(movieTitle)}&time=${encodeURIComponent(show.time)}&price=${show.price}&format=${show.format}`)
            }
          />
        ))}
      </div>
    </div>
  );
}

function TheatreShowRow({ theatre, onSelect }) {
  return (
    <div className="bst-theatre-card">
      <div className="bst-theatre-header">
        <div className="bst-theatre-left">
          <h3 className="bst-theatre-name">{theatre.name}</h3>
          <p className="bst-theatre-address">📍 {theatre.address}</p>
          <div className="bst-amenities">
            {(theatre.amenities || []).map(a => (
              <span key={a} className="bst-amenity">{a}</span>
            ))}
          </div>
        </div>
        {theatre.rating && (
          <div className="bst-theatre-rating">
            <span className="bst-rating-star">⭐</span>
            <span className="bst-rating-val">{theatre.rating}</span>
          </div>
        )}
      </div>
      <div className="bst-shows-row">
        {theatre.shows.map(show => (
          <button
            key={show.id}
            className={`bst-show-btn${show.seatsLeft < 10 ? ' filling' : ''}`}
            onClick={() => onSelect(show)}
          >
            <span className="bst-show-time">{show.time}</span>
            {show.format !== '2D' && <span className="bst-show-format">{show.format}</span>}
            <span className="bst-show-price">₹{show.price}</span>
            {show.seatsLeft < 10 && <span className="bst-filling-fast">Filling Fast</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
