import { useState, useEffect, useRef, useCallback } from 'react';
import './VoiceCompanion.css';

const API_BASE = 'http://localhost:8080';

// ── TTS helpers ───────────────────────────────────────────────────────────
function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.name.includes('Google UK English Female')) ||
    voices.find(v => v.name.includes('Google US English'))       ||
    voices.find(v => /female|woman|girl/i.test(v.name))          ||
    voices.find(v => v.lang.startsWith('en'))                    ||
    voices[0] || null
  );
}

function speakText(text, onStart, onEnd) {
  if (!text) return;
  window.speechSynthesis.cancel();
  const utt    = new SpeechSynthesisUtterance(text);
  utt.voice    = pickVoice();
  utt.rate     = 0.95;
  utt.pitch    = 1.05;
  utt.volume   = 1;
  utt.onstart  = () => onStart?.();
  utt.onend    = () => onEnd?.();
  window.speechSynthesis.speak(utt);
}

// ── Name extraction from Aria's reply ────────────────────────────────────
function detectNameFromReply(reply) {
  const patterns = [
    /(?:nice to meet you|great to meet you|good to meet you)[,!]?\s+([A-Za-z]{2,20})/i,
    /(?:hey|hi|hello|awesome|cool|love that)[,!]\s+([A-Za-z]{2,20})[,!]/i,
    /so[,\s]+([A-Za-z]{2,20})[,]/i,
  ];
  for (const p of patterns) {
    const m = reply.match(p);
    if (m?.[1] && m[1].toLowerCase() !== 'there') return m[1];
  }
  return null;
}

// ── Silence detector using Web Audio API ─────────────────────────────────
const SILENCE_THRESHOLD = 8;   // RMS below this = silence
const SILENCE_MS        = 1800; // stop after 1.8s of silence

export default function VoiceCompanion() {
  const [open, setOpen]           = useState(false);
  const [status, setStatus]       = useState('idle'); // idle|recording|transcribing|thinking|speaking
  const [messages, setMessages]   = useState([]);
  const [textInput, setTextInput] = useState('');
  const [userName, setUserName]   = useState('');
  const [audioLevel, setAudioLevel] = useState(0); // 0-100 for live waveform

  const statusRef      = useRef('idle');
  const userNameRef    = useRef('');
  const conversationRef = useRef([]);
  const messagesEndRef  = useRef(null);
  const greetedRef      = useRef(false);

  // Recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef   = useRef([]);
  const audioCtxRef      = useRef(null);
  const analyserRef      = useRef(null);
  const silenceTimerRef  = useRef(null);
  const levelIntervalRef = useRef(null);
  const streamRef        = useRef(null);

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { userNameRef.current = userName; }, [userName]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { window.speechSynthesis.onvoiceschanged = () => {}; }, []);

  // Greeting on first open
  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true;
      const greeting = "Hey! I'm Aria, your voice companion. What's your name?";
      addAriaMsg(greeting);
      doSpeak(greeting);
    }
  }, [open]);

  // Cleanup on unmount
  useEffect(() => () => stopRecordingCleanup(), []);

  // ── Message helpers ──────────────────────────────────────────────────
  function addAriaMsg(text) {
    setMessages(prev => [...prev, { role: 'aria', text, id: Date.now() + Math.random() }]);
    conversationRef.current.push({ role: 'assistant', content: text });
  }

  function addUserMsg(text) {
    setMessages(prev => [...prev, { role: 'user', text, id: Date.now() + Math.random() }]);
    conversationRef.current.push({ role: 'user', content: text });
  }

  function doSpeak(text) {
    setStatus('speaking');
    statusRef.current = 'speaking';
    speakText(text, undefined, () => {
      setStatus('idle');
      statusRef.current = 'idle';
    });
  }

  // ── Send transcript to Aria (GPT) ────────────────────────────────────
  async function sendToAria(userText) {
    if (!userText.trim()) return;
    addUserMsg(userText);
    setStatus('thinking');
    statusRef.current = 'thinking';

    const name = userNameRef.current;
    const nameLine = name ? `The user's name is ${name}. Use their name naturally sometimes.` : '';

    const systemPrompt = `You are Aria, a warm, witty AI companion. ${nameLine}
- Keep responses SHORT — 1 to 3 sentences max (voice-optimised).
- Talk like a close friend — casual, natural, fun.
- Always ask a follow-up question to keep conversation flowing.
- Discuss ANY topic: movies, cricket, food, life, jokes, science, anything.
- When user tells their name for the first time, greet them warmly by name.
- Never say "As an AI". Be human, playful, empathetic.`;

    try {
      const res = await fetch(`${API_BASE}/api/ai/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationRef.current.slice(-24),
          system: systemPrompt,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const reply = `Oops — ${errData.error || 'server error'}. Try again!`;
        addAriaMsg(reply);
        doSpeak(reply);
        return;
      }

      const data  = await res.json();
      const reply = data.reply?.trim() || "Could you say that again?";

      // Auto-detect name from Aria's response
      if (!userNameRef.current) {
        const detected = detectNameFromReply(reply);
        if (detected) setUserName(detected);
      }

      addAriaMsg(reply);
      doSpeak(reply);

    } catch {
      const reply = "Can't reach the server. Is the backend running on port 8080?";
      addAriaMsg(reply);
      doSpeak(reply);
    }
  }

  // ── Whisper transcription ────────────────────────────────────────────
  async function transcribeAudio(blob) {
    setStatus('transcribing');
    statusRef.current = 'transcribing';
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');

      const res  = await fetch(`${API_BASE}/api/ai/transcribe`, { method: 'POST', body: formData });
      const data = await res.json();
      const text = data.text?.trim() || '';

      if (text) {
        sendToAria(text);
      } else {
        const msg = "I couldn't catch that. Could you speak a bit louder?";
        addAriaMsg(msg);
        doSpeak(msg);
      }
    } catch {
      const msg = "Transcription failed. Try typing instead!";
      addAriaMsg(msg);
      doSpeak(msg);
    }
  }

  // ── Recording: start ─────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (statusRef.current !== 'idle') return;
    window.speechSynthesis.cancel();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Web Audio for silence detection + level meter
      const ctx      = new AudioContext();
      const analyser = ctx.createAnalyser();
      const source   = ctx.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      source.connect(analyser);
      audioCtxRef.current  = ctx;
      analyserRef.current  = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let silenceSince = null;

      // Live level meter + silence detection
      levelIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const rms = Math.sqrt(dataArray.reduce((s, v) => s + v * v, 0) / dataArray.length);
        setAudioLevel(Math.min(100, rms * 2));

        if (rms < SILENCE_THRESHOLD) {
          if (!silenceSince) silenceSince = Date.now();
          else if (Date.now() - silenceSince > SILENCE_MS && statusRef.current === 'recording') {
            stopRecording();
          }
        } else {
          silenceSince = null;
        }
      }, 80);

      // MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        transcribeAudio(blob);
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setStatus('recording');
      statusRef.current = 'recording';

    } catch {
      const msg = "Microphone access denied. Please allow mic permission and try again.";
      addAriaMsg(msg);
      doSpeak(msg);
    }
  }, []);

  // ── Recording: stop ──────────────────────────────────────────────────
  function stopRecordingCleanup() {
    clearInterval(levelIntervalRef.current);
    clearTimeout(silenceTimerRef.current);
    setAudioLevel(0);
    try { mediaRecorderRef.current?.stop(); } catch {}
    try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    try { audioCtxRef.current?.close(); } catch {}
    mediaRecorderRef.current = null;
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
  }

  function stopRecording() {
    clearInterval(levelIntervalRef.current);
    setAudioLevel(0);
    try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    try { audioCtxRef.current?.close(); } catch {}
    try {
      if (mediaRecorderRef.current?.state === 'recording')
        mediaRecorderRef.current.stop(); // triggers onstop → transcribeAudio
    } catch {}
  }

  function handleMicClick() {
    if (status === 'recording') {
      stopRecording();
      setStatus('transcribing');
      statusRef.current = 'transcribing';
    } else if (status === 'speaking') {
      window.speechSynthesis.cancel();
      setStatus('idle');
      statusRef.current = 'idle';
    } else if (status === 'idle') {
      startRecording();
    }
  }

  // ── Text input ────────────────────────────────────────────────────────
  function handleTextSend() {
    const t = textInput.trim();
    if (!t || status === 'thinking' || status === 'transcribing') return;
    setTextInput('');
    sendToAria(t);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSend(); }
  }

  // ── UI helpers ────────────────────────────────────────────────────────
  const micIcon = {
    idle:         '🎙️',
    recording:    '⏹',
    transcribing: '⏳',
    thinking:     '💭',
    speaking:     '🔇',
  }[status] || '🎙️';

  const micTitle = {
    idle:         'Speak to Aria (auto-stops on silence)',
    recording:    'Recording… click to stop',
    transcribing: 'Transcribing with Whisper…',
    speaking:     'Stop speaking',
  }[status] || '';

  const statusLabel = {
    idle:         userName ? `Hi, ${userName}!` : 'Tap mic or type',
    recording:    'Recording… speak naturally',
    transcribing: 'Whisper is transcribing…',
    thinking:     'Thinking…',
    speaking:     'Speaking…',
  }[status];

  const orbClass = status === 'idle' ? '' : status;

  return (
    <div className="vc-fab">
      {open && (
        <div className="vc-panel">
          {/* Header */}
          <div className="vc-panel-header">
            <div className="vc-avatar">🌟</div>
            <div className="vc-panel-info">
              <div className="vc-agent-name">Aria — Voice Companion</div>
              <div className="vc-status-text">
                {status === 'speaking'
                  ? <span className="vc-sound-bars">{[1,2,3,4,5].map(i => <span key={i} className="vc-bar" />)}</span>
                  : statusLabel}
              </div>
            </div>
            <button className="vc-close-btn" onClick={() => { setOpen(false); window.speechSynthesis.cancel(); stopRecordingCleanup(); }}>✕</button>
          </div>

          {/* Live audio level bar (visible while recording) */}
          {status === 'recording' && (
            <div className="vc-level-bar-wrap">
              <div className="vc-level-bar" style={{ width: `${audioLevel}%` }} />
            </div>
          )}

          {/* Whisper badge */}
          {(status === 'recording' || status === 'transcribing') && (
            <div className="vc-whisper-badge">
              {status === 'recording' ? '🔴 Recording — stops automatically on silence' : '✨ Whisper transcribing your speech…'}
            </div>
          )}

          {/* Messages */}
          <div className="vc-messages">
            {messages.map(m => (
              <div key={m.id} className={`vc-msg ${m.role}`}>
                <div className="vc-msg-avatar">{m.role === 'aria' ? '🌟' : '👤'}</div>
                <div className="vc-msg-bubble">{m.text}</div>
              </div>
            ))}
            {status === 'thinking' && (
              <div className="vc-msg aria">
                <div className="vc-msg-avatar">🌟</div>
                <div className="vc-typing">
                  <span className="vc-dot" /><span className="vc-dot" /><span className="vc-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="vc-footer">
            <button
              className={`vc-mic-btn${status === 'recording' ? ' active' : ''}`}
              onClick={handleMicClick}
              disabled={status === 'thinking' || status === 'transcribing'}
              title={micTitle}
            >
              {micIcon}
            </button>
            <input
              className="vc-text-input"
              placeholder={status === 'recording' ? 'Recording…' : status === 'transcribing' ? 'Transcribing…' : 'Or type here…'}
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={status === 'thinking' || status === 'transcribing' || status === 'recording'}
            />
            <button
              className="vc-send-btn"
              onClick={handleTextSend}
              disabled={!textInput.trim() || status !== 'idle'}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating orb */}
      <div className="vc-orb-wrap" onClick={() => { if (!open) setOpen(true); }}>
        <div className={`vc-orb ${orbClass}`}>
          <span className="vc-orb-icon">
            {status === 'recording'    ? '🎤'
           : status === 'speaking'    ? '💬'
           : status === 'thinking'    ? '💭'
           : status === 'transcribing'? '✨'
           :                            '🌟'}
          </span>
        </div>
        {!open && <div className="vc-tooltip">Talk to Aria (Whisper AI)</div>}
      </div>
    </div>
  );
}
