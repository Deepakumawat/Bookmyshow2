import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SmartAgent.css';

const API_BASE = 'http://localhost:8080/api/ai';

const QUICK_ACTIONS = [
  { label: '🎬 Action movies',     msg: 'Show me action movies playing now' },
  { label: '🏏 IPL tickets',       msg: 'I want to book IPL cricket match tickets' },
  { label: '🎤 Live concerts',     msg: 'Find live concerts and music events' },
  { label: '🎥 Book IMAX tonight', msg: 'Book an IMAX movie for tonight' },
  { label: '🎭 Comedy show',       msg: 'Book comedy show tickets' },
  { label: '⭐ Top rated movies',  msg: 'What are the best rated movies right now?' },
];

// ── TTS ──────────────────────────────────────────────────────────────────
function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.name.includes('Google UK English Female')) ||
    voices.find(v => v.name.includes('Google US English'))       ||
    voices.find(v => /female|woman/i.test(v.name))               ||
    voices.find(v => v.lang.startsWith('en'))                    ||
    voices[0] || null
  );
}

function speakText(text, onStart, onEnd) {
  if (!text) return;
  // Strip markdown and truncate for voice
  const clean = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\n/g, ' ')
    .slice(0, 280);
  window.speechSynthesis.cancel();
  const utt   = new SpeechSynthesisUtterance(clean);
  utt.voice   = pickVoice();
  utt.rate    = 0.96;
  utt.pitch   = 1.05;
  utt.volume  = 1;
  utt.onstart = () => onStart?.();
  utt.onend   = () => onEnd?.();
  window.speechSynthesis.speak(utt);
}

// ── Name extractor from Nova's reply ─────────────────────────────────────
function detectName(reply) {
  const p = [
    /(?:nice|great|good) to meet you[,!]?\s+([A-Za-z]{2,20})/i,
    /hey[,!]\s+([A-Za-z]{2,20})[,!]/i,
    /hi[,!]\s+([A-Za-z]{2,20})[,!]/i,
    /hello[,!]\s+([A-Za-z]{2,20})[,!]/i,
    /awesome[,!]\s+([A-Za-z]{2,20})[,!]/i,
  ];
  for (const r of p) {
    const m = reply.match(r);
    if (m?.[1] && !['there','you','it'].includes(m[1].toLowerCase())) return m[1];
  }
  return null;
}

// ── Silence detection config ─────────────────────────────────────────────
const SILENCE_THRESHOLD = 8;
const SILENCE_MS        = 1800;

export default function SmartAgent() {
  const navigate = useNavigate();

  const [open,       setOpen]       = useState(false);
  const [status,     setStatus]     = useState('idle'); // idle|recording|transcribing|thinking|speaking
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [steps,      setSteps]      = useState([]);
  const [userName,   setUserName]   = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  const statusRef    = useRef('idle');
  const userNameRef  = useRef('');
  const historyRef   = useRef([]);   // {role, content} pairs for API
  const bottomRef    = useRef(null);
  const inputRef     = useRef(null);
  const greetedRef   = useRef(false);

  const mediaRecRef  = useRef(null);
  const chunksRef    = useRef([]);
  const audioCtxRef  = useRef(null);
  const streamRef    = useRef(null);
  const levelIntRef  = useRef(null);

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { userNameRef.current = userName; }, [userName]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, steps]);
  useEffect(() => { window.speechSynthesis.onvoiceschanged = () => {}; }, []);
  useEffect(() => () => stopRecordingCleanup(), []);

  // Greeting on first open
  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true;
      setTimeout(() => inputRef.current?.focus(), 120);
      const greeting = "Hey! I'm Nova — your smart AI companion. I can chat about anything AND book your tickets. What's your name?";
      pushAssistantMsg(greeting, 'text', {});
      doSpeak(greeting);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  // ── Message helpers ───────────────────────────────────────────────────
  function pushAssistantMsg(content, type, data) {
    const msg = { id: Date.now() + Math.random(), role: 'assistant', type, content, data };
    setMessages(prev => [...prev, msg]);
    historyRef.current.push({ role: 'assistant', content });
    return msg;
  }

  function pushUserMsg(content) {
    const msg = { id: Date.now() + Math.random(), role: 'user', type: 'text', content, data: {} };
    setMessages(prev => [...prev, msg]);
    historyRef.current.push({ role: 'user', content });
  }

  function doSpeak(text) {
    setStatus('speaking');
    statusRef.current = 'speaking';
    speakText(text, undefined, () => {
      setStatus('idle');
      statusRef.current = 'idle';
    });
  }

  // ── Send to Nova backend ─────────────────────────────────────────────
  async function send(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    pushUserMsg(msg);
    setStatus('thinking');
    statusRef.current = 'thinking';
    setSteps([]);

    try {
      const res  = await fetch(`${API_BASE}/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyRef.current.slice(-30),
          city:     localStorage.getItem('bms_city') || 'Jaipur',
          userName: userNameRef.current,
        }),
      });

      const data = await res.json();
      setSteps(data.steps || []);

      const reply  = data.reply || '';
      const type   = data.type  || 'text';
      const rdata  = data.data  || {};

      // Detect name from Nova's greeting reply
      if (!userNameRef.current && reply) {
        const detected = detectName(reply);
        if (detected) setUserName(detected);
      }

      pushAssistantMsg(reply, type, rdata);
      if (reply) doSpeak(reply);

    } catch {
      const err = "Can't reach the server. Is the backend running on port 8080?";
      pushAssistantMsg(err, 'text', {});
      doSpeak(err);
    } finally {
      setStatus(s => s === 'thinking' ? 'idle' : s);
      statusRef.current = statusRef.current === 'thinking' ? 'idle' : statusRef.current;
      setSteps([]);
    }
  }

  // ── Whisper transcription ─────────────────────────────────────────────
  async function transcribeAudio(blob) {
    setStatus('transcribing');
    statusRef.current = 'transcribing';
    try {
      const fd = new FormData();
      fd.append('audio', blob, 'recording.webm');
      const res  = await fetch(`${API_BASE}/transcribe`, { method: 'POST', body: fd });
      const data = await res.json();
      const text = data.text?.trim() || '';
      if (text) {
        send(text);
      } else {
        const m = "I couldn't catch that. Try speaking louder or type below!";
        pushAssistantMsg(m, 'text', {});
        doSpeak(m);
      }
    } catch {
      const m = "Transcription failed. You can type your message instead.";
      pushAssistantMsg(m, 'text', {});
      doSpeak(m);
    }
  }

  // ── MediaRecorder start ───────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (statusRef.current !== 'idle') return;
    window.speechSynthesis.cancel();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx      = new AudioContext();
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 256;
      audioCtxRef.current = ctx;

      const dataArr    = new Uint8Array(analyser.frequencyBinCount);
      let silenceSince = null;

      levelIntRef.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArr);
        const rms = Math.sqrt(dataArr.reduce((s, v) => s + v * v, 0) / dataArr.length);
        setAudioLevel(Math.min(100, rms * 2));
        if (rms < SILENCE_THRESHOLD) {
          if (!silenceSince) silenceSince = Date.now();
          else if (Date.now() - silenceSince > SILENCE_MS && statusRef.current === 'recording')
            stopRecording();
        } else { silenceSince = null; }
      }, 80);

      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus' : 'audio/webm';
      const rec  = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime });
        transcribeAudio(blob);
      };
      rec.start(100);
      mediaRecRef.current = rec;
      setStatus('recording');
      statusRef.current = 'recording';
    } catch {
      const m = "Microphone access denied — please allow mic permission.";
      pushAssistantMsg(m, 'text', {});
      doSpeak(m);
    }
  }, []);

  function stopRecording() {
    clearInterval(levelIntRef.current);
    setAudioLevel(0);
    try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    try { audioCtxRef.current?.close(); } catch {}
    try {
      if (mediaRecRef.current?.state === 'recording') mediaRecRef.current.stop();
    } catch {}
  }

  function stopRecordingCleanup() {
    clearInterval(levelIntRef.current);
    setAudioLevel(0);
    try { mediaRecRef.current?.stop(); } catch {}
    try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    try { audioCtxRef.current?.close(); } catch {}
  }

  function handleMicClick() {
    if (status === 'recording') { stopRecording(); setStatus('transcribing'); statusRef.current = 'transcribing'; }
    else if (status === 'speaking') { window.speechSynthesis.cancel(); setStatus('idle'); statusRef.current = 'idle'; }
    else if (status === 'idle') startRecording();
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  // ── Card interaction helpers ─────────────────────────────────────────
  function selectItem(item, type) {
    const title = item.title || item.name || '';
    const msg = type === 'movies' ? `Book tickets for "${title}"`
              : type === 'events' ? `Book tickets for the event "${title}"`
              :                     `Book tickets for "${title}" match`;
    send(msg);
  }

  function selectTiming(theatre, show, movieTitle) {
    send(`Book ${show.format} show at ${show.time} at ${theatre.theatre} for "${movieTitle}"`);
  }

  function confirmPay(bookingData) {
    navigate('/confirmation', {
      state: {
        booking: {
          id: bookingData.bookingId, title: bookingData.title,
          venue: bookingData.venue, city: bookingData.city,
          time: bookingData.time,  tier: bookingData.seatCategory,
          qty: bookingData.count,  totalAmount: bookingData.total, type: 'agent',
        }
      }
    });
    setOpen(false);
  }

  // ── UI helpers ────────────────────────────────────────────────────────
  const isBusy = status === 'thinking' || status === 'transcribing' || status === 'recording';

  const micIcon = status === 'recording'    ? '⏹'
                : status === 'transcribing' ? '⏳'
                : status === 'speaking'     ? '🔇'
                : '🎙️';

  const statusText = {
    idle:         userName ? `Hi, ${userName}! Chat or book tickets.` : 'Chat or book tickets with voice',
    recording:    '🔴 Recording… speak naturally, auto-stops on silence',
    transcribing: '✨ Whisper is transcribing your speech…',
    thinking:     'Nova is thinking…',
    speaking:     'Nova is speaking…',
  }[status];

  const orbClass = status === 'idle' ? '' : status;

  return (
    <>
      {/* Panel */}
      {open && (
        <div className="nova-panel">
          {/* Header */}
          <div className="nova-header">
            <div className="nova-avatar">✨</div>
            <div className="nova-header-info">
              <div className="nova-agent-name">Nova — Smart AI Agent</div>
              <div className="nova-status-row">
                {status === 'speaking'
                  ? <span className="nova-sound-bars">{[1,2,3,4,5].map(i=><span key={i} className="nova-bar"/>)}</span>
                  : <><span className="nova-online-dot"/><span>{isBusy ? statusText : (userName ? `Hi, ${userName}!` : 'Online · GPT-4o + Whisper')}</span></>
                }
              </div>
            </div>
            <button className="nova-close" onClick={() => { setOpen(false); window.speechSynthesis.cancel(); stopRecordingCleanup(); }}>✕</button>
          </div>

          {/* Audio level */}
          {status === 'recording' && (
            <div className="nova-level-wrap">
              <div className="nova-level-bar" style={{ width: `${audioLevel}%` }} />
            </div>
          )}

          {/* Status badge */}
          {(status === 'recording' || status === 'transcribing') && (
            <div className="nova-status-badge">{statusText}</div>
          )}

          {/* Messages */}
          <div className="nova-body">
            {messages.map(msg => (
              <div key={msg.id} className={`nova-msg-row ${msg.role}`}>
                {msg.role === 'assistant' && <div className="nova-bot-avatar">✨</div>}
                <div className="nova-bubble-wrap">
                  {msg.content && (
                    <div className={`nova-bubble ${msg.role}`}>
                      <MarkdownText text={msg.content} />
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.type === 'movies' && msg.data?.items?.length > 0 && (
                    <div className="nova-cards">
                      {msg.data.items.map((m,i) => <MovieCard key={i} movie={m} onSelect={() => selectItem(m,'movies')} />)}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.type === 'events' && msg.data?.items?.length > 0 && (
                    <div className="nova-cards">
                      {msg.data.items.map((e,i) => <EventCard key={i} event={e} onSelect={() => selectItem(e,'events')} />)}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.type === 'sports' && msg.data?.items?.length > 0 && (
                    <div className="nova-cards">
                      {msg.data.items.map((s,i) => <SportCard key={i} sport={s} onSelect={() => selectItem(s,'sports')} />)}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.type === 'timings' && msg.data?.timings?.length > 0 && (
                    <div className="nova-timings">
                      {msg.data.timings.map((th,i) => (
                        <TheatreCard key={i} theatre={th} movieTitle={msg.data.movieTitle}
                          onSelect={show => selectTiming(th, show, msg.data.movieTitle)} />
                      ))}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.type === 'seats' && msg.data?.categories?.length > 0 && (
                    <SeatSelector data={msg.data}
                      onSelect={(cat, qty) => send(`Book ${qty} ${cat.label} seat${qty>1?'s':''} at ₹${cat.price} each for "${msg.data.title}"`)} />
                  )}
                  {msg.role === 'assistant' && msg.type === 'booking_confirmed' && (
                    <BookingCard booking={msg.data} onView={() => confirmPay(msg.data)} />
                  )}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {status === 'thinking' && (
              <div className="nova-msg-row assistant">
                <div className="nova-bot-avatar">✨</div>
                <div className="nova-bubble-wrap">
                  <div className="nova-bubble assistant nova-thinking">
                    <span className="nova-dot-anim"/><span className="nova-dot-anim"/><span className="nova-dot-anim"/>
                  </div>
                  {steps.map((s,i) => <div key={i} className="nova-step">{s}</div>)}
                </div>
              </div>
            )}

            {/* Quick actions on first load */}
            {messages.length <= 1 && !isBusy && (
              <div className="nova-quick-wrap">
                <div className="nova-quick-label">Quick actions</div>
                <div className="nova-quick-grid">
                  {QUICK_ACTIONS.map((a,i) => (
                    <button key={i} className="nova-quick-btn" onClick={() => send(a.msg)}>{a.label}</button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div className="nova-footer">
            <button
              className={`nova-mic-btn${status === 'recording' ? ' recording' : ''}`}
              onClick={handleMicClick}
              disabled={status === 'thinking' || status === 'transcribing'}
              title={status === 'recording' ? 'Stop recording' : status === 'speaking' ? 'Stop speaking' : 'Speak to Nova (Whisper AI)'}
            >
              {micIcon}
            </button>
            <input
              ref={inputRef}
              className="nova-input"
              placeholder={isBusy ? statusText : "Ask Nova anything or say 'book tickets'…"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={isBusy}
            />
            <button className="nova-send-btn" onClick={() => send()} disabled={isBusy || !input.trim()}>
              {status === 'thinking' ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}

      {/* Floating orb */}
      <div className="nova-fab">
        <div className="nova-orb-wrap" onClick={() => { if (!open) setOpen(true); else { setOpen(false); window.speechSynthesis.cancel(); stopRecordingCleanup(); } }}>
          <div className={`nova-orb ${orbClass}`}>
            <span className="nova-orb-icon">
              {status === 'recording'    ? '🎤'
             : status === 'transcribing'? '✨'
             : status === 'thinking'    ? '💭'
             : status === 'speaking'    ? '💬'
             : open                     ? '✕'
             :                           '✨'}
            </span>
          </div>
          <div className="nova-label">{open ? 'Close Nova' : 'Nova — Chat & Book'}</div>
        </div>
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function MarkdownText({ text }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function MovieCard({ movie, onSelect }) {
  const pct = movie.imdbRating ? Math.min(99, Math.round(movie.imdbRating * 10)) : 85;
  return (
    <div className="nova-mini-card">
      <img src={`https://picsum.photos/seed/nv${movie.id}/60/90`} alt={movie.title} className="nova-mini-poster"
        onError={e => { e.target.src = `https://picsum.photos/seed/nv${movie.id}x/60/90`; }} />
      <div className="nova-mini-info">
        <div className="nova-mini-title">{movie.title}</div>
        <div className="nova-mini-meta">👍 {pct}% · {(movie.genre||[]).slice(0,2).join(', ')}</div>
        <div className="nova-mini-meta">{(movie.format||['2D']).join(' · ')}</div>
      </div>
      <button className="nova-mini-btn" onClick={onSelect}>Select</button>
    </div>
  );
}

function EventCard({ event, onSelect }) {
  return (
    <div className="nova-mini-card">
      <div className="nova-mini-icon">🎤</div>
      <div className="nova-mini-info">
        <div className="nova-mini-title">{event.title}</div>
        <div className="nova-mini-meta">{event.artist}</div>
        <div className="nova-mini-meta">📅 {event.date} · 📍 {event.city}</div>
        <div className="nova-mini-meta">₹{event.price?.min ?? 500} onwards</div>
      </div>
      <button className="nova-mini-btn" onClick={onSelect}>Select</button>
    </div>
  );
}

function SportCard({ sport, onSelect }) {
  return (
    <div className="nova-mini-card">
      <div className="nova-mini-icon">🏆</div>
      <div className="nova-mini-info">
        <div className="nova-mini-title">{sport.title}</div>
        <div className="nova-mini-meta">{sport.league} · {sport.sport}</div>
        <div className="nova-mini-meta">📅 {sport.date} · 🏟️ {sport.city}</div>
        <div className="nova-mini-meta">₹{sport.price?.min ?? 300} onwards</div>
      </div>
      <button className="nova-mini-btn" onClick={onSelect}>Select</button>
    </div>
  );
}

function TheatreCard({ theatre, movieTitle, onSelect }) {
  return (
    <div className="nova-theatre-card">
      <div className="nova-theatre-name">{theatre.theatre}</div>
      <div className="nova-theatre-area">📍 {theatre.area || ''}</div>
      <div className="nova-show-slots">
        {(theatre.shows||[]).map((show,i) => (
          <button key={i} className="nova-show-slot" onClick={() => onSelect(show)}>
            <span className="nova-slot-time">{show.time}</span>
            <span className="nova-slot-fmt">{show.format}</span>
            <span className="nova-slot-price">₹{show.price}</span>
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
    <div className="nova-seat-selector">
      <div className="nova-seat-title">Choose seats for <strong>{data.title}</strong></div>
      <div className="nova-seat-cats">
        {(data.categories||[]).map((cat,i) => (
          <div key={i} className={`nova-seat-cat${selected?.id===cat.id?' selected':''}`} onClick={() => setSelected(cat)}>
            <span className="nova-seat-icon">{cat.icon}</span>
            <div className="nova-seat-info">
              <div className="nova-seat-label">{cat.label}</div>
              <div className="nova-seat-desc">{cat.desc}</div>
            </div>
            <div className="nova-seat-price">₹{cat.price}</div>
            {selected?.id===cat.id && <div className="nova-seat-check">✓</div>}
          </div>
        ))}
      </div>
      {selected && (
        <div className="nova-seat-footer">
          <div className="nova-qty-row">
            <span>Tickets</span>
            <div className="nova-qty-ctrl">
              <button onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(8,q+1))}>+</button>
            </div>
          </div>
          <div className="nova-seat-total">
            Total: ₹{(selected.price*qty + 30*qty).toLocaleString('en-IN')}
            <span className="nova-seat-conv">(incl. ₹{30*qty} conv.)</span>
          </div>
          <button className="nova-confirm-btn" onClick={() => onSelect(selected, qty)}>
            Confirm {qty} {selected.label} Ticket{qty>1?'s':''}
          </button>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, onView }) {
  return (
    <div className="nova-booking-card">
      <div className="nova-booking-check">✓</div>
      <div className="nova-booking-id">Booking ID: <strong>{booking.bookingId}</strong></div>
      <div className="nova-booking-rows">
        <div className="nova-booking-row"><span>🎬</span><span>{booking.title}</span></div>
        <div className="nova-booking-row"><span>📍</span><span>{booking.venue}</span></div>
        <div className="nova-booking-row"><span>⏰</span><span>{booking.time}</span></div>
        <div className="nova-booking-row"><span>🏷️</span><span>{booking.seatCategory} × {booking.count}</span></div>
        <div className="nova-booking-row total"><span>💰</span><span>₹{booking.total?.toLocaleString('en-IN')}</span></div>
      </div>
      <button className="nova-view-btn" onClick={onView}>View Full Ticket →</button>
    </div>
  );
}
