/**
 * BookMyShow AI Service
 * Integrates Claude API for intelligent features:
 * - Movie recommendations using NLP
 * - Smart seat suggestions
 * - Natural language search
 * - Agentic task automation
 */

class AIService {
  constructor(apiKey = null) {
    this.apiKey = apiKey || localStorage.getItem('bms-claude-key');
    this.baseUrl = 'http://localhost:3001/api/ai';
    this.mcpServerUrl = 'http://localhost:3002';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('bms-claude-key', key);
  }

  /**
   * Get movie recommendations based on user preferences
   * Uses agentic AI to understand user preferences and suggest movies
   */
  async getMovieRecommendations(userPreferences) {
    try {
      const response = await fetch(`${this.baseUrl}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          type: 'movie_recommendations',
          preferences: userPreferences,
          context: 'user_browsing_movies'
        })
      });

      if (!response.ok) throw new Error('Failed to get recommendations');
      return await response.json();
    } catch (error) {
      console.error('[AIService] Recommendation error:', error);
      throw error;
    }
  }

  /**
   * Process natural language input for movie search
   * Examples: "Find action movies near Mumbai this Friday"
   *           "Show me horror movies with good ratings"
   */
  async processNLSearch(query) {
    try {
      const response = await fetch(`${this.baseUrl}/nlp-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          query,
          intent: 'movie_search',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('NLP search failed');
      return await response.json();
    } catch (error) {
      console.error('[AIService] NLP search error:', error);
      throw error;
    }
  }

  /**
   * Get smart seat recommendations based on user history
   * Considers comfort, price, and previous selections
   */
  async getSmartSeatRecommendations(showId, userHistory = []) {
    try {
      const response = await fetch(`${this.baseUrl}/seat-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          showId,
          userHistory,
          criteria: ['comfort', 'price', 'view_angle']
        })
      });

      if (!response.ok) throw new Error('Failed to get seat recommendations');
      return await response.json();
    } catch (error) {
      console.error('[AIService] Seat recommendation error:', error);
      throw error;
    }
  }

  /**
   * Start an agentic AI conversation for booking assistance
   * Agent can: search movies, check availability, process payments
   */
  async startAIAgent(userMessage, context = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            userLocation: context.userLocation,
            preferences: context.preferences,
            bookingHistory: context.bookingHistory,
            timestamp: new Date().toISOString()
          },
          tools: [
            'search_movies',
            'check_availability',
            'get_showtimes',
            'process_booking',
            'apply_offers'
          ]
        })
      });

      if (!response.ok) throw new Error('AI agent request failed');
      return await response.json();
    } catch (error) {
      console.error('[AIService] AI agent error:', error);
      throw error;
    }
  }

  /**
   * Get analytics-powered insights
   * Predicts popular shows, trending cities, peak booking times
   */
  async getAIInsights(insightType = 'trending') {
    try {
      const response = await fetch(`${this.baseUrl}/insights`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey
        },
        params: { type: insightType }
      });

      if (!response.ok) throw new Error('Failed to fetch insights');
      return await response.json();
    } catch (error) {
      console.error('[AIService] Insights error:', error);
      throw error;
    }
  }

  /**
   * MCP Server integration - get tools and resources
   */
  async getMCPTools() {
    try {
      const response = await fetch(`${this.mcpServerUrl}/tools`);
      if (!response.ok) throw new Error('Failed to fetch MCP tools');
      return await response.json();
    } catch (error) {
      console.error('[AIService] MCP tools error:', error);
      return [];
    }
  }

  /**
   * Execute MCP tool with parameters
   */
  async executeMCPTool(toolName, params) {
    try {
      const response = await fetch(`${this.mcpServerUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: toolName, params })
      });

      if (!response.ok) throw new Error(`MCP tool execution failed: ${toolName}`);
      return await response.json();
    } catch (error) {
      console.error(`[AIService] MCP tool error (${toolName}):`, error);
      throw error;
    }
  }

  /**
   * Process multi-step booking workflow with AI optimization
   */
  async optimizeBookingWorkflow(bookingData) {
    try {
      const response = await fetch(`${this.baseUrl}/optimize-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          ...bookingData,
          optimizationGoals: ['best_price', 'best_seats', 'convenience']
        })
      });

      if (!response.ok) throw new Error('Booking optimization failed');
      return await response.json();
    } catch (error) {
      console.error('[AIService] Booking optimization error:', error);
      throw error;
    }
  }
}

export default new AIService();
