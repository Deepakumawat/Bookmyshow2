package Bookmyshow2.controllers;

import Bookmyshow2.models.*;
import Bookmyshow2.repositories.*;
import Bookmyshow2.service.AgentService;
import Bookmyshow2.service.OpenAIService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Value("${openai.api.key:}")
    private String apiKey;

    @Autowired private OpenAIService openAIService;
    @Autowired private AgentService agentService;
    @Autowired private ShowRepository showRepo;
    @Autowired private ShowSeatRepository showSeatRepo;
    @Autowired private SeatTypeShowRepository seatTypeShowRepo;
    @Autowired private MovieRepository movieRepo;

    private final ObjectMapper mapper = new ObjectMapper();

    // ── Level-3 Agentic AI ──────────────────────────────────────────────────
    @PostMapping("/agent")
    public ResponseEntity<?> agent(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> messages = (List<Map<String, Object>>) request.getOrDefault("messages", List.of());
            String city     = request.getOrDefault("city", "Jaipur").toString();
            String userName = request.getOrDefault("userName", "").toString();
            Map<String, Object> result = agentService.chat(messages, city, userName);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Whisper Speech-to-Text ─────────────────────────────────────────
    private static final String WHISPER_URL    = "https://api.openai.com/v1/audio/transcriptions";
    private static final String OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate voiceRT = new RestTemplate();

    @PostMapping("/transcribe")
    public ResponseEntity<?> transcribe(@RequestParam("audio") MultipartFile audio) {
        if (apiKey == null || apiKey.isBlank())
            return ResponseEntity.ok(Map.of("text", ""));
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(apiKey);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            String filename = "audio." + getExtension(audio.getContentType());
            ByteArrayResource audioResource = new ByteArrayResource(audio.getBytes()) {
                @Override public String getFilename() { return filename; }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("model", "whisper-1");
            body.add("language", "en");
            body.add("file", audioResource);

            ResponseEntity<String> resp = voiceRT.postForEntity(
                WHISPER_URL, new HttpEntity<>(body, headers), String.class);

            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(resp.getBody());
            String text = root.path("text").asText("").trim();
            return ResponseEntity.ok(Map.of("text", text));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    private String getExtension(String contentType) {
        if (contentType == null) return "webm";
        if (contentType.contains("ogg"))  return "ogg";
        if (contentType.contains("mp4"))  return "mp4";
        if (contentType.contains("wav"))  return "wav";
        return "webm";
    }

    @PostMapping("/voice")
    public ResponseEntity<?> voice(@RequestBody Map<String, Object> request) {
        if (apiKey == null || apiKey.isBlank())
            return ResponseEntity.ok(Map.of("reply", "OpenAI API key not configured."));
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> messages =
                (List<Map<String, Object>>) request.getOrDefault("messages", List.of());
            String system = request.getOrDefault("system",
                "You are Aria, a warm and friendly AI companion. Keep responses short (1-3 sentences). Be natural, ask follow-up questions, discuss any topic.").toString();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            List<Map<String, Object>> openAiMessages = new ArrayList<>();
            openAiMessages.add(Map.of("role", "system", "content", system));
            openAiMessages.addAll(messages);

            Map<String, Object> body = new java.util.LinkedHashMap<>();
            body.put("model", "gpt-4o-mini");
            body.put("messages", openAiMessages);
            body.put("temperature", 0.85);
            body.put("max_tokens", 150);

            ResponseEntity<String> resp = voiceRT.postForEntity(
                OPENAI_CHAT_URL, new HttpEntity<>(body, headers), String.class);

            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(resp.getBody());
            String reply = root.path("choices").get(0).path("message").path("content").asText("...");
            return ResponseEntity.ok(Map.of("reply", reply));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Cache refresh ───────────────────────────────────────────────────
    @PostMapping("/cache/clear")
    public ResponseEntity<?> clearCache() {
        openAIService.clearCache();
        return ResponseEntity.ok(Map.of("message", "Cache cleared. Next requests will fetch fresh AI data."));
    }

    // ── Movies currently in Indian cinemas ──────────────────────────────
    @GetMapping("/movies")
    public ResponseEntity<?> getMovies(
            @RequestParam(defaultValue = "en") String lang,
            @RequestParam(defaultValue = "all") String genre) {
        try {
            String system = """
                You are a real-time Indian cinema database assistant.
                Always respond with valid JSON only — no markdown, no extra text.
                """;
            String user = """
                Generate a JSON object with key "movies" containing an array of 14 movies
                currently showing in Indian cinemas in April 2026.
                Include a mix of Bollywood, Hollywood, and South Indian films.
                Each movie must have:
                  id (number), title (string), genre (array of strings),
                  language (string — primary language), languages (array — all dubbed versions available in India),
                  duration (string like "148 min"), certification (U/UA/A),
                  director (string), cast (array of 3-4 actor names),
                  imdbRating (number 6.0-9.5), description (2-3 sentence plot summary),
                  releaseDate (YYYY-MM-DD in 2025-2026),
                  format (array — e.g. ["2D","3D","IMAX"]),
                  votes (number — likes count in thousands like "142K"),
                  bgColor (a hex color matching the movie's theme).
                Return only the JSON, nothing else.
                """;
            String json = openAIService.askOpenAI("movies-" + lang + "-" + genre, system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Live Events in India ────────────────────────────────────────────
    @GetMapping("/events")
    public ResponseEntity<?> getEvents(@RequestParam(defaultValue = "Mumbai") String city) {
        try {
            String system = "You are an Indian live events database. Respond with valid JSON only.";
            String user = String.format("""
                Generate a JSON object with key "events" containing an array of 12 upcoming
                live events happening in Indian cities in April-May 2026.
                Include concerts, music festivals, comedy shows, food festivals, cultural fests.
                Each event must have:
                  id (number), title (string), category (string — Concert/Comedy/Festival/Cultural),
                  artist (string — performer or organizer name),
                  venue (string — actual famous venue name), city (string — Indian city),
                  date (string — April or May 2026 date like "25 Apr 2026"),
                  time (string like "7:00 PM"), duration (string like "3 hours"),
                  price (object with min and max in rupees),
                  description (1-2 sentences),
                  tags (array of 2-3 tags),
                  language (string), ageLimit (string like "18+" or "All ages"),
                  availableSeats (number 10-500).
                Include events from cities: Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune.
                Focus on city: %s but include others too.
                Return only JSON, nothing else.
                """, city);
            String json = openAIService.askOpenAI("events-" + city, system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Sports Events in India ──────────────────────────────────────────
    @GetMapping("/sports")
    public ResponseEntity<?> getSports() {
        try {
            String system = "You are an Indian sports events database. Respond with valid JSON only.";
            String user = """
                Generate a JSON object with key "sports" containing an array of 14 upcoming
                sports events and matches in India for April-May 2026.
                Include IPL cricket matches, Pro Kabaddi, ISL football, badminton, tennis,
                wrestling (WWE India), F1 (if any), kabaddi, chess tournaments.
                Each sport event must have:
                  id (number), title (string — e.g. "MI vs CSK — IPL 2026"),
                  sport (string — Cricket/Football/Kabaddi/Badminton/Tennis/etc),
                  league (string — IPL/ISL/PKL/etc),
                  teams (array of 2 team names, or single performer for individual sport),
                  venue (string — actual Indian stadium/arena name),
                  city (string), date (string — April-May 2026),
                  time (string), price (object with min and max in rupees),
                  description (1 sentence), category (string — Team Sport/Individual Sport),
                  availableSeats (number), tags (array).
                Return only JSON, nothing else.
                """;
            String json = openAIService.askOpenAI("sports-india", system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Plays & Theatre ────────────────────────────────────────────────
    @GetMapping("/plays")
    public ResponseEntity<?> getPlays(@RequestParam(defaultValue = "Mumbai") String city) {
        try {
            String system = "You are an Indian theatre and plays database. Respond with valid JSON only.";
            String user = String.format("""
                Generate a JSON object with key "plays" containing 10 upcoming theatre plays
                and dramatic performances in Indian cities in April-May 2026.
                Include Hindi, English, and regional language plays.
                Each play must have:
                  id (number), title (string), language (string), genre (string — Drama/Comedy/Musical/etc),
                  director (string), cast (array), venue (string — actual theatre name),
                  city (string — Indian city), date (string), time (string),
                  duration (string), price (object with min and max),
                  description (2 sentences), ageLimit (string), availableSeats (number).
                Focus on city: %s but include other cities.
                Return only JSON, nothing else.
                """, city);
            String json = openAIService.askOpenAI("plays-" + city, system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── AI Movie Recommendations ────────────────────────────────────────
    @PostMapping("/recommend")
    public ResponseEntity<?> recommend(@RequestBody Map<String, Object> body) {
        try {
            String genres = body.getOrDefault("genres", "Action, Drama").toString();
            String languages = body.getOrDefault("languages", "Hindi, English").toString();
            String system = "You are a smart movie recommendation engine. Respond with valid JSON only.";
            String user = String.format("""
                A user likes these genres: %s and watches in: %s.
                Recommend 6 movies (currently in Indian cinemas or streaming) that match their taste.
                Return JSON: { "recommendations": [ { id, title, genre, language, imdbRating,
                description (1 sentence why this matches), matchScore (percent 70-99) } ] }
                """, genres, languages);
            String json = openAIService.askOpenAI("rec-" + genres + languages, system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Coming Soon Movies ──────────────────────────────────────────────
    @GetMapping("/coming-soon")
    public ResponseEntity<?> getComingSoon() {
        try {
            String system = "You are an Indian cinema upcoming releases database. Respond with valid JSON only.";
            String user = """
                Generate a JSON object with key "movies" containing 8 upcoming movies
                releasing in Indian cinemas in May-August 2026 (not yet released).
                Include Bollywood, Hollywood, and South Indian films.
                Each movie must have:
                  id (number, start from 100), title (string), genre (array of strings),
                  language (string), languages (array), duration (string like "148 min"),
                  certification (U/UA/A), director (string), cast (array of 3 names),
                  releaseDate (YYYY-MM-DD, between May-Aug 2026),
                  releaseLabel (string like "May 15" or "Releasing June 2026"),
                  format (array like ["2D","3D","IMAX"]),
                  description (1-2 sentences),
                  bgColor (a dark hex color matching the movie's theme).
                Return only the JSON, nothing else.
                """;
            String json = openAIService.askOpenAI("coming-soon", system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Premieres ───────────────────────────────────────────────────────
    @GetMapping("/premieres")
    public ResponseEntity<?> getPremieres() {
        try {
            String system = "You are a BookMyShow India premieres database. Respond with valid JSON only.";
            String user = """
                Generate a JSON object with key "premieres" containing 6 special premiere
                movie events happening in Indian cinemas in April-May 2026.
                These are exclusive premiere screenings (first-day-first-show, red carpet, etc.)
                Each premiere must have:
                  id (number, start from 200), title (string), genre (array),
                  language (string), director (string),
                  premiereDate (string like "25 Apr 2026"), premiereTime (string like "6:00 PM"),
                  venue (string — famous multiplex like PVR, INOX, Cinepolis),
                  city (string — Indian city), price (number — premium premiere ticket price in rupees),
                  description (1 sentence), cast (array of 2-3 names),
                  bgColor (dark hex color).
                Return only the JSON, nothing else.
                """;
            String json = openAIService.askOpenAI("premieres-india", system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Natural Language Search ─────────────────────────────────────────
    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody Map<String, Object> body) {
        try {
            String query = body.getOrDefault("query", "").toString();
            String system = "You are a BookMyShow search engine. Respond with valid JSON only.";
            String user = String.format("""
                User searched for: "%s" on BookMyShow India.
                Return the 8 most relevant results (movies, events, or sports) for this query.
                JSON: { "results": [ { id, title, type (Movie/Event/Sport/Play),
                category, date, venue, city, price, description (1 sentence), relevance (1-10) } ] }
                """, query);
            String json = openAIService.askOpenAI("search-" + query, system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── ML: Mood-Based Movie Recommendation ────────────────────────────
    @PostMapping("/mood-recommend")
    public ResponseEntity<?> moodRecommend(@RequestBody Map<String, Object> body) {
        try {
            String mood  = body.getOrDefault("mood", "happy").toString();
            String grade = body.getOrDefault("ageGroup", "adult").toString();
            String system = "You are a mood-aware movie recommendation AI for BookMyShow India. Respond with valid JSON only.";
            String user = String.format("""
                A user feels: "%s" and wants to watch a movie in Indian cinemas.
                Age group: %s.
                Recommend 6 movies currently showing in India that best match this mood.
                For each, explain WHY it matches the mood in 1 sentence.
                JSON: { "mood": "%s", "recommendations": [
                  { "id": number, "title": string, "genre": string, "language": string,
                    "imdbRating": number, "matchReason": string, "moodScore": number (70-99),
                    "certification": string, "format": string }
                ] }
                """, mood, grade, mood);
            String json = openAIService.askOpenAI("mood-" + mood + grade, system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── ML: Dynamic Pricing based on Occupancy ─────────────────────────
    @GetMapping("/dynamic-price")
    public ResponseEntity<?> dynamicPrice(
            @RequestParam Long showId,
            @RequestParam(defaultValue = "GOLD") String seatType) {
        try {
            Optional<Show> showOpt = showRepo.findById(showId);
            if (showOpt.isEmpty()) return ResponseEntity.notFound().build();
            Show show = showOpt.get();

            List<ShowSeat> allSeats = showSeatRepo.findByShow(show);
            long total  = allSeats.size();
            long booked = allSeats.stream().filter(ss -> ss.getStatus() == SeatStatus.BOOKED).count();
            double occupancyPct = total > 0 ? (booked * 100.0 / total) : 0;

            // Base price from SeatTypeShow
            List<SeatTypeShow> pricing = seatTypeShowRepo.findByShow(show);
            SeatType sType = SeatType.valueOf(seatType.toUpperCase());
            double basePrice = pricing.stream()
                    .filter(p -> p.getSeatType() == sType)
                    .mapToDouble(SeatTypeShow::getPrice)
                    .findFirst().orElse(300.0);

            // Surge pricing: +10% per 20% occupancy bracket above 40%
            double surge = 1.0;
            if (occupancyPct >= 80) surge = 1.35;
            else if (occupancyPct >= 60) surge = 1.20;
            else if (occupancyPct >= 40) surge = 1.10;

            double dynamicPrice = Math.round(basePrice * surge);
            String trend = occupancyPct >= 80 ? "Filling Fast!" :
                           occupancyPct >= 60 ? "Going Fast"    :
                           occupancyPct >= 40 ? "Selling Well"  : "Available";

            return ResponseEntity.ok(Map.of(
                "showId",       showId,
                "seatType",     seatType,
                "basePrice",    basePrice,
                "dynamicPrice", dynamicPrice,
                "surgeMultiplier", surge,
                "occupancyPct", Math.round(occupancyPct),
                "seatsTotal",   total,
                "seatsBooked",  booked,
                "trend",        trend
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── ML: Show Occupancy Stats ────────────────────────────────────────
    @GetMapping("/occupancy")
    public ResponseEntity<?> occupancy(@RequestParam Long showId) {
        try {
            Optional<Show> showOpt = showRepo.findById(showId);
            if (showOpt.isEmpty()) return ResponseEntity.notFound().build();
            Show show = showOpt.get();

            List<ShowSeat> allSeats = showSeatRepo.findByShow(show);

            long total    = allSeats.size();
            long booked   = allSeats.stream().filter(ss -> ss.getStatus() == SeatStatus.BOOKED).count();
            long available = total - booked;
            double pct    = total > 0 ? Math.round(booked * 100.0 / total) : 0;

            Map<String, Long> byType = new LinkedHashMap<>();
            for (SeatType st : SeatType.values()) {
                long cnt = allSeats.stream()
                        .filter(ss -> ss.getSeat() != null && ss.getSeat().getSeatType() == st && ss.getStatus() == SeatStatus.AVAILABLE)
                        .count();
                byType.put(st.name(), cnt);
            }

            return ResponseEntity.ok(Map.of(
                "showId",          showId,
                "totalSeats",      total,
                "bookedSeats",     booked,
                "availableSeats",  available,
                "occupancyPct",    pct,
                "availableByType", byType,
                "status", pct >= 90 ? "Almost Full" : pct >= 70 ? "Filling Fast" : pct >= 40 ? "Selling Well" : "Available"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── ML: Smart Seat Recommendation ──────────────────────────────────
    @PostMapping("/smart-seats")
    public ResponseEntity<?> smartSeats(@RequestBody Map<String, Object> body) {
        try {
            Long   showId    = Long.parseLong(body.getOrDefault("showId", "1").toString());
            int    partySize = Integer.parseInt(body.getOrDefault("partySize", "2").toString());
            String pref      = body.getOrDefault("preference", "middle").toString(); // front/middle/back/aisle

            Optional<Show> showOpt = showRepo.findById(showId);
            if (showOpt.isEmpty()) return ResponseEntity.notFound().build();
            Show show = showOpt.get();

            // Get available seats
            List<ShowSeat> available = showSeatRepo.findByShow(show).stream()
                    .filter(ss -> ss.getStatus() == SeatStatus.AVAILABLE && ss.getSeat() != null)
                    .collect(Collectors.toList());

            // Get pricing
            List<SeatTypeShow> pricing = seatTypeShowRepo.findByShow(show);

            // Use AI to pick best seats
            List<Map<String, Object>> seatList = available.stream().limit(30).map(ss -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("seatName", ss.getSeat().getName());
                m.put("seatType", ss.getSeat().getSeatType().name());
                m.put("row",      String.valueOf(ss.getSeat().getName().charAt(0)));
                m.put("col",      ss.getSeat().getName().substring(1));
                return m;
            }).collect(Collectors.toList());

            String seatListStr = seatList.stream()
                    .map(s -> s.get("seatName") + "(" + s.get("seatType") + ")")
                    .collect(Collectors.joining(", "));

            String system = "You are a smart seat selection AI for a movie theatre. Respond with valid JSON only.";
            String user = String.format("""
                Available seats in the theatre: %s
                Party size: %d people
                Seating preference: %s (front/middle/back/aisle)
                Row A-B = Silver (cheapest, front), C-D = Gold (mid), E = Platinum (back-mid), F = Recliner (premium, back)
                Select the BEST %d consecutive or nearby seats matching the preference.
                JSON: { "recommendedSeats": ["seatName1", "seatName2", ...],
                        "seatType": "GOLD",
                        "reason": "why these seats are best (1 sentence)",
                        "totalPrice": number }
                """, seatListStr, partySize, pref, partySize);

            String json = openAIService.askOpenAI("seats-" + showId + partySize + pref, system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── ML: Sentiment Analysis on Reviews ──────────────────────────────
    @PostMapping("/sentiment")
    public ResponseEntity<?> sentiment(@RequestBody Map<String, Object> body) {
        try {
            @SuppressWarnings("unchecked")
            List<String> reviews = (List<String>) body.getOrDefault("reviews", List.of());
            String movieTitle    = body.getOrDefault("movieTitle", "this movie").toString();

            String system = "You are a sentiment analysis AI for movie reviews. Respond with valid JSON only.";
            String user = String.format("""
                Analyze the sentiment of these reviews for "%s":
                %s
                Return:
                JSON: {
                  "overallSentiment": "Positive/Negative/Mixed",
                  "positiveScore": number (0-100),
                  "negativeScore": number (0-100),
                  "neutralScore": number (0-100),
                  "topPraises": ["phrase1", "phrase2", "phrase3"],
                  "topComplaints": ["phrase1", "phrase2"],
                  "summary": "1-2 sentence audience verdict",
                  "recommendationRate": number (0-100)
                }
                """, movieTitle, String.join("\n- ", reviews));
            String json = openAIService.askOpenAI("sentiment-" + movieTitle.hashCode(), system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── ML: Personalized Home Feed ──────────────────────────────────────
    @PostMapping("/personalized")
    public ResponseEntity<?> personalized(@RequestBody Map<String, Object> body) {
        try {
            @SuppressWarnings("unchecked")
            List<String> genres    = (List<String>) body.getOrDefault("genres", List.of("Action", "Drama"));
            @SuppressWarnings("unchecked")
            List<String> languages = (List<String>) body.getOrDefault("languages", List.of("Hindi"));
            @SuppressWarnings("unchecked")
            List<String> history   = (List<String>) body.getOrDefault("watchHistory", List.of());
            String city            = body.getOrDefault("city", "Mumbai").toString();

            String system = "You are a personalized content AI for BookMyShow India. Respond with valid JSON only.";
            String user = String.format("""
                User profile:
                - Favourite genres: %s
                - Preferred languages: %s
                - City: %s
                - Recently watched: %s
                Generate a personalized home feed for this user.
                JSON: {
                  "featuredMovie": { title, genre, language, imdbRating, whyRecommended, format },
                  "recommendedMovies": [ { title, genre, language, imdbRating, matchScore } ] (6 movies),
                  "trendingInCity": [ { title, venue, date, category } ] (3 events in %s),
                  "newReleases": [ { title, releaseDate, genre, language } ] (3 upcoming),
                  "personalizedMessage": "greeting for user based on their taste (1 sentence)"
                }
                """, genres, languages, city, history.isEmpty() ? "none yet" : history, city);
            String json = openAIService.askOpenAI("feed-" + city + genres + languages, system, user);
            return ResponseEntity.ok(mapper.readTree(json));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── DB: All Movies ──────────────────────────────────────────────────
    @GetMapping("/db/movies")
    public ResponseEntity<?> dbMovies() {
        return ResponseEntity.ok(movieRepo.findAll());
    }

    // ── DB: All Shows ───────────────────────────────────────────────────
    @GetMapping("/db/shows")
    public ResponseEntity<?> dbShows() {
        return ResponseEntity.ok(showRepo.findAll());
    }
}
