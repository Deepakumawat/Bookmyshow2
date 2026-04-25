# BookMyShow Advanced - Setup & Quick Start

## 🚀 Quick Start (5 minutes)

### Terminal 1: Start MCP Server
```bash
cd C:\BookMyShow_Advanced
node mcp-server.js
```

### Terminal 2: Start React App
```bash
cd C:\BookMyShow_Advanced
npm install  # First time only
npm run dev
```

### Open Browser
```
http://localhost:5173
```

## ✨ Features to Try

1. **Dark/Light Theme Toggle**
   - Click "Dark" or "Light" button in header
   - Theme persists across refreshes

2. **NLP Search**
   - Search box: "Find action movies near Mumbai"
   - AI processes and returns results

3. **AI Assistant Chat**
   - Click blue bubble (bottom-right)
   - Type: "Help me book Inception tickets"
   - Agent handles complete workflow

4. **Smart Seats**
   - During booking, AI recommends optimal seats
   - Based on comfort, price, view angle

5. **MCP Tools**
   - 8 AI-powered tools for movie data
   - Running on http://localhost:3002

## 📁 Project Structure

```
C:\BookMyShow_Advanced\
├── src/
│   ├── context/ThemeContext.jsx      (Dark/Light mode)
│   ├── services/AIService.js         (Claude + MCP)
│   ├── components/ai/
│   │   ├── SmartSearch.jsx           (NLP search)
│   │   └── AIAssistant.jsx           (Agentic chat)
│   ├── styles/theme.css              (Theme variables)
│   ├── App.jsx                       (Main UI)
│   └── main.jsx
├── mcp-server.js                     (MCP Server - Port 3002)
├── package.json
└── index.html
```

## 🎨 Dark/Light Theme

**Light Theme**:
- Primary: #399aff (Blue)
- Background: #f8fafc (Light gray)
- Text: #1e293b (Dark)

**Dark Theme**:
- Primary: #06b6d4 (Cyan)
- Background: #0f172a (Very dark blue)
- Text: #e2e8f0 (Light gray)

Toggle in header → Persists in localStorage

## 🤖 AI Integration

### Three AI Components:

1. **SmartSearch** (NLP)
   - Natural language movie search
   - Processes: "Find action movies near me"

2. **AIAssistant** (Agentic)
   - Full booking automation
   - Understands intent, takes actions, reports results

3. **AIService** (Backend)
   - Connects to Claude API
   - Executes MCP tools
   - Manages booking workflows

## 🔌 MCP Server (mcp-server.js)

Port: 3002

Available tools:
```
1. search_movies - Search by title/genre/city
2. get_showtimes - Get available times
3. check_availability - Seat availability
4. get_recommendations - ML suggestions
5. process_nlp - NLP query parsing
6. optimize_seats - Smart seat selection
7. book_tickets - Complete booking
8. apply_offers - Apply discounts
```

Test tool:
```bash
curl -X POST http://localhost:3002/execute \
  -H "Content-Type: application/json" \
  -d '{"tool":"search_movies","params":{"query":"inception"}}'
```

## 📦 Package.json Scripts

```bash
npm run dev           # Start Vite dev server (port 5173)
npm run build         # Build for production
npm run preview       # Preview production build
node mcp-server.js    # Run MCP server (port 3002)
```

## 🔑 Setting Claude API Key (Optional)

1. Get key from https://console.anthropic.com
2. In app, click AI Assistant → Set key
3. Stored in localStorage (client-only)

## 🧪 Test Scenarios

### Test 1: Dark Mode
1. Click "Dark" button
2. UI changes to dark theme
3. Refresh → Theme persists

### Test 2: NLP Search
1. Type: "Find action movies near Mumbai"
2. Click Search
3. AI processes → Returns movie results

### Test 3: AI Agent
1. Click chat bubble
2. Type: "Show me Inception tickets"
3. Agent searches → Checks availability → Recommends seats

## 🐛 Troubleshooting

**MCP Server won't start?**
- Check port 3002 is free: `netstat -ano | findstr :3002`
- Kill process: `taskkill /PID [PID] /F`

**React app won't start?**
- Delete node_modules: `rm -r node_modules`
- Reinstall: `npm install`
- Clear cache: `npm cache clean --force`

**Theme not persisting?**
- Check localStorage enabled in browser
- DevTools → Application → Local Storage

**Search returns no results?**
- MCP server must be running (port 3002)
- Check browser console for errors
- Verify query format

## 📚 API Endpoints

### Frontend (Vite)
- **Dev Server**: http://localhost:5173
- **Hot Reload**: Enabled

### MCP Server
- **Base URL**: http://localhost:3002
- **GET /tools** - List all tools
- **POST /execute** - Execute tool
- **GET /health** - Health check

### Spring Boot Backend (Future)
- **Base URL**: http://localhost:8080
- **API**: /api/movies, /api/bookings, etc.

## 🌐 Browser Compatibility

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 Next Steps

1. Run `node mcp-server.js` in Terminal 1
2. Run `npm run dev` in Terminal 2
3. Open http://localhost:5173
4. Click "Dark" to test theme
5. Try NLP search: "action movies"
6. Click chat bubble for AI agent

## 🎯 Goals Achieved

✅ Dark/Light theme with smooth transitions
✅ NLP-powered natural language search
✅ Agentic AI for booking assistance
✅ MCP server with 8 AI tools
✅ Modern React with Vite
✅ Persistent theme preference
✅ Responsive design
✅ Mock data (ready for real DB)

---

**Ready to build advanced AI products!** 🚀
