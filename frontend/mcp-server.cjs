#!/usr/bin/env node

/**
 * BookMyShow MCP Server
 * Provides tools and resources for Claude AI integration
 * - Movie recommendations
 * - NLP search processing
 * - Seat optimization
 * - Booking workflows
 * - Real-time availability
 */

const http = require('http');
const { Readable } = require('stream');

// MCP Tools Registry
const tools = {
  search_movies: {
    name: 'search_movies',
    description: 'Search for movies by title, genre, language, or city',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        genre: { type: 'string', description: 'Movie genre' },
        city: { type: 'string', description: 'City for showtimes' },
        language: { type: 'string', description: 'Movie language' }
      }
    }
  },

  get_showtimes: {
    name: 'get_showtimes',
    description: 'Get available showtimes for a movie',
    inputSchema: {
      type: 'object',
      properties: {
        movie_id: { type: 'string', description: 'Movie ID' },
        city: { type: 'string', description: 'City' },
        date: { type: 'string', description: 'Show date (YYYY-MM-DD)' }
      },
      required: ['movie_id', 'city']
    }
  },

  check_availability: {
    name: 'check_availability',
    description: 'Check seat availability and pricing',
    inputSchema: {
      type: 'object',
      properties: {
        show_id: { type: 'string', description: 'Show ID' },
        seat_type: { type: 'string', description: 'Seat type (standard, premium, recliner)' }
      },
      required: ['show_id']
    }
  },

  get_recommendations: {
    name: 'get_recommendations',
    description: 'Get AI-powered movie recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        user_preferences: {
          type: 'object',
          description: 'User preferences (genres, languages, etc)'
        },
        location: { type: 'string', description: 'User location' }
      }
    }
  },

  process_nlp: {
    name: 'process_nlp',
    description: 'Process natural language for movie search',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Natural language query' }
      },
      required: ['text']
    }
  },

  optimize_seats: {
    name: 'optimize_seats',
    description: 'Get optimized seat recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        show_id: { type: 'string', description: 'Show ID' },
        user_history: { type: 'array', description: 'Previous seat selections' },
        preferences: { type: 'object', description: 'User preferences' }
      },
      required: ['show_id']
    }
  },

  book_tickets: {
    name: 'book_tickets',
    description: 'Book movie tickets',
    inputSchema: {
      type: 'object',
      properties: {
        show_id: { type: 'string', description: 'Show ID' },
        seats: { type: 'array', description: 'Selected seat IDs' },
        user_id: { type: 'string', description: 'User ID' }
      },
      required: ['show_id', 'seats']
    }
  },

  apply_offers: {
    name: 'apply_offers',
    description: 'Get and apply available offers and discounts',
    inputSchema: {
      type: 'object',
      properties: {
        total_amount: { type: 'number', description: 'Total booking amount' },
        city: { type: 'string', description: 'City' }
      }
    }
  }
};

// Mock Implementation of Tool Execution
const executeTool = (toolName, params) => {
  console.log(`[MCP] Executing tool: ${toolName}`, params);

  switch(toolName) {
    case 'search_movies':
      return {
        success: true,
        movies: [
          { id: '1', title: 'Inception', genre: 'Sci-Fi', language: 'English', rating: 8.8 },
          { id: '2', title: 'Dark Knight', genre: 'Action', language: 'English', rating: 9.0 },
          { id: '3', title: 'Interstellar', genre: 'Sci-Fi', language: 'English', rating: 8.6 }
        ]
      };

    case 'get_showtimes':
      return {
        success: true,
        showtimes: [
          { id: 'show1', movie_id: params.movie_id, time: '10:00 AM', screen: 1, theater: 'IMAX' },
          { id: 'show2', movie_id: params.movie_id, time: '1:00 PM', screen: 2, theater: 'Standard' },
          { id: 'show3', movie_id: params.movie_id, time: '4:30 PM', screen: 3, theater: 'Premium' }
        ]
      };

    case 'check_availability':
      return {
        success: true,
        available_seats: 45,
        total_seats: 100,
        pricing: {
          standard: 200,
          premium: 350,
          recliner: 500
        }
      };

    case 'get_recommendations':
      return {
        success: true,
        recommendations: [
          { id: '1', title: 'Recommended Movie 1', match: 95 },
          { id: '2', title: 'Recommended Movie 2', match: 87 },
          { id: '3', title: 'Recommended Movie 3', match: 82 }
        ]
      };

    case 'process_nlp':
      return {
        success: true,
        intent: 'search_movies',
        entities: {
          genre: 'action',
          location: 'Mumbai',
          date: 'today',
          time: 'evening'
        }
      };

    case 'optimize_seats':
      return {
        success: true,
        recommended_seats: ['H5', 'H6', 'H7'],
        reasoning: 'Center seats with good view angle and comfortable distance'
      };

    case 'book_tickets':
      return {
        success: true,
        booking_id: 'BMS' + Date.now(),
        status: 'confirmed',
        total_price: params.seats.length * 250
      };

    case 'apply_offers':
      return {
        success: true,
        available_offers: [
          { code: 'WELCOME20', discount: 20, description: '20% off' },
          { code: 'MOVIE50', discount: 50, description: 'Flat 50 off' }
        ]
      };

    default:
      return { success: false, error: 'Unknown tool' };
  }
};

// HTTP Server
const PORT = process.env.MCP_PORT || 3002;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // List tools
  if (req.method === 'GET' && req.url === '/tools') {
    res.writeHead(200);
    res.end(JSON.stringify({
      tools: Object.values(tools).map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema
      }))
    }));
    return;
  }

  // Execute tool
  if (req.method === 'POST' && req.url === '/execute') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { tool, params } = JSON.parse(body);
        const result = executeTool(tool, params);
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', version: '1.0.0' }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║    BookMyShow MCP Server Started      ║
  ║                                       ║
  ║    Port: ${PORT}                        ║
  ║    Endpoints:                         ║
  ║    - GET /tools                       ║
  ║    - POST /execute                    ║
  ║    - GET /health                      ║
  ║                                       ║
  ║    Tools available: ${Object.keys(tools).length}                       ║
  ╚═══════════════════════════════════════╝
  `);
});

process.on('SIGINT', () => {
  console.log('\nShutting down MCP Server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
