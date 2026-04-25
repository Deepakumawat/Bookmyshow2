import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AiAgent.css';

const BASE = 'http://localhost:8080/api/ai/agent';

const QUICK_ACTIONS = [
  { label: '🎬 Action movies',       msg: 'Show me action movies playing now' },
  { label: '🏏 IPL tickets',         msg: 'I want to book IPL cricket match tickets' },
  { label: '🎤 Concerts',            msg: 'Find live concerts and music events' },
  { label: '🎭 Comedy show',         msg: 'Book comedy show tickets' },
  { label: '🎥 Book IMAX movie',     msg: 'Book an IMAX movie for tonight' },
  { label: '⭐ Best rated movies',   msg: 'What are the best rated movies right now?' },
];

export default function AiAgent() {
  const navigate  = useNavigate();
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [steps,    setSteps]    = useState([]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: 'welcome', role: 'assistant', type: 'text',
        content: "Hi! I'm your **BMS AI Agent** 🤖\n\nI can **search & book** movies, sports, events, and plays for you — completely hands-free.\n\nJust tell me what you want!",
        data: {}
      }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, steps]);

  async function send(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', type: 'text', content: msg, data: {} };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setSteps([]);

    // Build history for backend (only text messages)
    const history = [...messages, userMsg]
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res  = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          city: localStorage.getItem('bms_city') || 'Jaipur'
        })
      });
      const data = await res.json();
      setSteps(data.steps || []);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        type: data.type || 'text',
        content: data.reply || '',
        data: data.data || {}
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant', type: 'text',
        content: "Sorry, I couldn't connect to the server. Make sure the backend is running.",
        data: {}
      }]);
    } finally {
      setLoading(false);
      setSteps([]);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  // User clicked a card item — send its title as the next message
  function selectItem(item, type) {
    const title = item.title || item.name || '';
    const msg   = type === 'movies'  ? `I want to book tickets for "${title}"`
                : type === 'events'  ? `Book tickets for "${title}" event`
                : type === 'sports'  ? `Book tickets for "${title}" match`
                : `Book tickets for "${title}"`;
    send(msg);
  }

  function selectTiming(theatre, show, movieTitle) {
    send(`Book ${show.format} show at ${show.time} at ${theatre.theatre} for "${movieTitle}"`);
  }

  function selectSeat(cat, title, type) {
    const [qty, setQty] = [1]; // handled in SeatSelector
    send(`I want ${cat.label} seats (₹${cat.price}/ticket) for "${title}"`);
  }

  function confirmPay(bookingData) {
    navigate('/confirmation', {
      state: {
        booking: {
          id:           bookingData.bookingId,
          title:        bookingData.title,
          venue:        bookingData.venue,
          city:         bookingData.city,
          time:         bookingData.time,
          tier:         bookingData.seatCategory,
          qty:          bookingData.count,
          totalAmount:  bookingData.total,
          type:         'agent',
        }
      }
    });
    setOpen(false);
  }

  return (
    <>
      {/* Floating trigger button */}
      <button className={`aia-trigger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)}
        title="AI Booking Agent">
        <span className="aia-trigger-icon">{open ? '✕' : '🤖'}</span>
        {!open && <span className="aia-trigger-label">AI Agent</span>}
        <span className="aia-pulse" />
      </button>

      {/* Agent panel */}
      {open && (
        <div className="aia-panel">
          {/* Header */}
          <div className="aia-header">
            <div className="aia-header-left">
              <div className="aia-avatar">🤖</div>
              <div>
                <div className="aia-name">BMS AI Agent</div>
                <div className="aia-status">
                  <span className="aia-dot" /> {loading ? 'Thinking…' : 'Online • Powered by GPT-4o'}
                </div>
              </div>
            </div>
            <button className="aia-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="aia-body">
            {messages.map(msg => (
              <div key={msg.id} className={`aia-msg-row ${msg.role}`}>
                {msg.role === 'assistant' && <div className="aia-bot-avatar">🤖</div>}
                <div className="aia-bubble-wrap">
                  {msg.content && (
                    <div className={`aia-bubble ${msg.role}`}>
                      <MarkdownText text={msg.content} />
                    </div>
                  )}
                  {/* Render interactive cards based on type */}
                  {msg.role === 'assistant' && msg.type === 'movies' && msg.data?.items?.length > 0 && (
                    <div className="aia-cards">
                      {msg.data.items.map((m, i) => (
                        <MovieMiniCard key={i} movie={m} onSelect={() => selectItem(m, 'movies')} />
                      ))}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.type === 'events' && msg.data?.items?.length > 0 && (
                    <div className="aia-cards">
                      {msg.data.items.map((e, i) => (
                        <EventMiniCard key={i} event={e} onSelect={() => selectItem(e, 'events')} />
                      ))}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.type === 'sports' && msg.data?.items?.length > 0 && (
                    <div className="aia-cards">
                      {msg.data.items.map((s, i) => (
                        <SportMiniCard key={i} sport={s} onSelect={() => selectItem(s, 'sports')} />
                      ))}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.type === 'timings' && msg.data?.timings?.length > 0 && (
                    <div className="aia-timings">
                      {msg.data.timings.map((th, i) => (
                        <TheatreTimingCard key={i} theatre={th} movieTitle={msg.data.movieTitle}
                          onSelect={(show) => selectTiming(th, show, msg.data.movieTitle)} />
                      ))}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.type === 'seats' && msg.data?.categories?.length > 0 && (
                    <SeatSelector data={msg.data} onSelect={(cat, qty) =>
                      send(`Book ${qty} ${cat.label} seat${qty > 1 ? 's' : ''} at ₹${cat.price} each for "${msg.data.title}"`)} />
                  )}
                  {msg.role === 'assistant' && msg.type === 'booking_confirmed' && (
                    <BookingConfirmCard booking={msg.data} onView={() => confirmPay(msg.data)} />
                  )}
                </div>
              </div>
            ))}

            {/* Loading / steps indicator */}
            {loading && (
              <div className="aia-msg-row assistant">
                <div className="aia-bot-avatar">🤖</div>
                <div className="aia-bubble-wrap">
                  <div className="aia-bubble assistant aia-thinking">
                    <span className="aia-dot-anim" /><span className="aia-dot-anim" /><span className="aia-dot-anim" />
                  </div>
                  {steps.map((s, i) => (
                    <div key={i} className="aia-step">{s}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions — only show when no messages except welcome */}
            {messages.length <= 1 && !loading && (
              <div className="aia-quick-wrap">
                <div className="aia-quick-label">Quick actions</div>
                <div className="aia-quick-grid">
                  {QUICK_ACTIONS.map((a, i) => (
                    <button key={i} className="aia-quick-btn" onClick={() => send(a.msg)}>{a.label}</button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="aia-footer">
            <input
              ref={inputRef}
              className="aia-input"
              placeholder="Ask me anything… 'Book 2 IMAX tickets tonight'"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button className="aia-send" onClick={() => send()} disabled={loading || !input.trim()}>
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Sub-card components ───────────────────────────────────────────────────

function MarkdownText({ text }) {
  // Minimal markdown: **bold**, \n → <br>
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function MovieMiniCard({ movie, onSelect }) {
  const pct = movie.imdbRating ? Math.min(99, Math.round(movie.imdbRating * 10)) : 85;
  return (
    <div className="aia-mini-card movie">
      <img src={`https://picsum.photos/seed/aim${movie.id}/60/90`} alt={movie.title} className="aia-mini-poster"
        onError={e => { e.target.src = `https://picsum.photos/seed/aim${movie.id}x/60/90`; }} />
      <div className="aia-mini-info">
        <div className="aia-mini-title">{movie.title}</div>
        <div className="aia-mini-meta">👍 {pct}% • {(movie.genre || []).slice(0,2).join(', ')}</div>
        <div className="aia-mini-meta">{(movie.format || ['2D']).join(' • ')}</div>
      </div>
      <button className="aia-mini-btn" onClick={onSelect}>Select</button>
    </div>
  );
}

function EventMiniCard({ event, onSelect }) {
  return (
    <div className="aia-mini-card event">
      <div className="aia-mini-icon">🎤</div>
      <div className="aia-mini-info">
        <div className="aia-mini-title">{event.title}</div>
        <div className="aia-mini-meta">{event.artist}</div>
        <div className="aia-mini-meta">📅 {event.date} • 📍 {event.city}</div>
        <div className="aia-mini-meta">₹{event.price?.min ?? 500} onwards</div>
      </div>
      <button className="aia-mini-btn" onClick={onSelect}>Select</button>
    </div>
  );
}

function SportMiniCard({ sport, onSelect }) {
  return (
    <div className="aia-mini-card sport">
      <div className="aia-mini-icon">🏆</div>
      <div className="aia-mini-info">
        <div className="aia-mini-title">{sport.title}</div>
        <div className="aia-mini-meta">{sport.league} • {sport.sport}</div>
        <div className="aia-mini-meta">📅 {sport.date} • 🏟️ {sport.city}</div>
        <div className="aia-mini-meta">₹{sport.price?.min ?? 300} onwards</div>
      </div>
      <button className="aia-mini-btn" onClick={onSelect}>Select</button>
    </div>
  );
}

function TheatreTimingCard({ theatre, movieTitle, onSelect }) {
  return (
    <div className="aia-theatre-card">
      <div className="aia-theatre-name">{theatre.theatre}</div>
      <div className="aia-theatre-area">📍 {theatre.area || theatre.address || ''}</div>
      <div className="aia-show-slots">
        {(theatre.shows || []).map((show, i) => (
          <button key={i} className="aia-show-slot" onClick={() => onSelect(show)}>
            <span className="aia-slot-time">{show.time}</span>
            <span className="aia-slot-fmt">{show.format}</span>
            <span className="aia-slot-price">₹{show.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SeatSelector({ data, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);

  return (
    <div className="aia-seat-selector">
      <div className="aia-seat-title">Choose your seats for <strong>{data.title}</strong></div>
      <div className="aia-seat-cats">
        {(data.categories || []).map((cat, i) => (
          <div key={i}
            className={`aia-seat-cat${selected?.id === cat.id ? ' selected' : ''}`}
            onClick={() => setSelected(cat)}>
            <span className="aia-seat-icon">{cat.icon}</span>
            <div className="aia-seat-info">
              <div className="aia-seat-label">{cat.label}</div>
              <div className="aia-seat-desc">{cat.desc}</div>
            </div>
            <div className="aia-seat-price">₹{cat.price}</div>
            {selected?.id === cat.id && <div className="aia-seat-check">✓</div>}
          </div>
        ))}
      </div>
      {selected && (
        <div className="aia-seat-footer">
          <div className="aia-qty-row">
            <span>Tickets</span>
            <div className="aia-qty-ctrl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(8, q + 1))}>+</button>
            </div>
          </div>
          <div className="aia-seat-total">
            Total: ₹{(selected.price * qty + 30 * qty).toLocaleString('en-IN')}
            <span className="aia-seat-conv">(incl. ₹{30 * qty} convenience)</span>
          </div>
          <button className="aia-confirm-btn" onClick={() => onSelect(selected, qty)}>
            Confirm {qty} {selected.label} Ticket{qty > 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}

function BookingConfirmCard({ booking, onView }) {
  return (
    <div className="aia-booking-card">
      <div className="aia-booking-check">✓</div>
      <div className="aia-booking-id">Booking ID: <strong>{booking.bookingId}</strong></div>
      <div className="aia-booking-rows">
        <div className="aia-booking-row"><span>🎬</span><span>{booking.title}</span></div>
        <div className="aia-booking-row"><span>📍</span><span>{booking.venue}</span></div>
        <div className="aia-booking-row"><span>⏰</span><span>{booking.time}</span></div>
        <div className="aia-booking-row"><span>🏷️</span><span>{booking.seatCategory} × {booking.count}</span></div>
        <div className="aia-booking-row total"><span>💰</span><span>₹{booking.total?.toLocaleString('en-IN')}</span></div>
      </div>
      <button className="aia-view-ticket-btn" onClick={onView}>View Full Ticket →</button>
    </div>
  );
}
