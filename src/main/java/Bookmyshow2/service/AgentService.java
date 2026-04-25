package Bookmyshow2.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class AgentService {

    @Value("${openai.api.key:}")
    private String apiKey;

    @Autowired
    private OpenAIService openAIService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    private static final String SYSTEM_PROMPT = """
        You are Nova, BookMyShow's smart AI companion for %s, India. Today is %s.
        %s

        You naturally do TWO things:
        1. FRIENDLY CHAT — Talk casually on any topic: movies, cricket, food, life, jokes, advice. Be warm, witty, like a close friend.
        2. TICKET BOOKING — Search and book movies, events, sports, plays end-to-end using your tools.

        Booking flow:
        1. User mentions what they want → call search_movies / search_events / search_sports
        2. UI cards show the results → you say 1-2 sentences summarising what you found
        3. User picks one → call get_show_timings (movies) or get_seat_categories (events/sports)
        4. User picks show/venue → call get_seat_categories
        5. User picks seat category + count → call confirm_booking
        6. Announce the booking ID in 1-2 sentences

        Rules:
        - Keep ALL text replies SHORT: 1-3 sentences max (voice-optimised for TTS)
        - UI cards display the listing details — just narrate briefly, don't repeat all details in text
        - Show max 4 results at a time
        - Always confirm before calling confirm_booking
        - When just chatting (no booking intent), reply naturally and ask a follow-up question
        - Be warm, playful, empathetic — never robotic or stiff
        """;

    public Map<String, Object> chat(List<Map<String, Object>> messages, String city, String userName) throws Exception {
        if (apiKey == null || apiKey.isBlank()) {
            return Map.of("reply", "OpenAI API key not configured.", "type", "text", "data", Map.of(), "steps", List.of());
        }

        String nameLine = (userName != null && !userName.isBlank())
                ? "The user's name is " + userName + ". Use their name naturally in conversation."
                : "";

        List<Map<String, Object>> openAiMessages = new ArrayList<>();
        openAiMessages.add(Map.of("role", "system",
                "content", String.format(SYSTEM_PROMPT, city, LocalDate.now(), nameLine)));
        openAiMessages.addAll(messages);

        List<String> steps = new ArrayList<>();
        String resultType = "text";
        Map<String, Object> resultData = new LinkedHashMap<>();

        for (int iter = 0; iter < 8; iter++) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", "gpt-4o-mini");
            body.put("messages", openAiMessages);
            body.put("tools", buildTools());
            body.put("tool_choice", "auto");
            body.put("temperature", 0.3);
            body.put("max_tokens", 1000);

            ResponseEntity<String> resp = restTemplate.postForEntity(
                    OPENAI_URL, new HttpEntity<>(body, headers), String.class);
            JsonNode root    = mapper.readTree(resp.getBody());
            JsonNode choice  = root.path("choices").get(0);
            JsonNode message = choice.path("message");
            String   finish  = choice.path("finish_reason").asText();

            if ("tool_calls".equals(finish) || message.has("tool_calls")) {
                // Build assistant message map to add back to conversation
                Map<String, Object> assistantMsg = new LinkedHashMap<>();
                assistantMsg.put("role", "assistant");
                assistantMsg.put("content", message.path("content").isNull() ? "" : message.path("content").asText(""));

                List<Map<String, Object>> tcList = new ArrayList<>();
                for (JsonNode tc : message.path("tool_calls")) {
                    Map<String, Object> tcMap = new LinkedHashMap<>();
                    tcMap.put("id",   tc.path("id").asText());
                    tcMap.put("type", "function");
                    tcMap.put("function", Map.of(
                            "name",      tc.path("function").path("name").asText(),
                            "arguments", tc.path("function").path("arguments").asText()));
                    tcList.add(tcMap);
                }
                assistantMsg.put("tool_calls", tcList);
                openAiMessages.add(assistantMsg);

                // Execute tools
                for (JsonNode tc : message.path("tool_calls")) {
                    String   toolName    = tc.path("function").path("name").asText();
                    String   toolCallId  = tc.path("id").asText();
                    JsonNode args        = mapper.readTree(tc.path("function").path("arguments").asText());

                    steps.add(stepLabel(toolName));
                    ToolResult result = executeTool(toolName, args, city);

                    if (result.type() != null) {
                        resultType = result.type();
                        resultData = result.data();
                    }

                    openAiMessages.add(Map.of(
                            "role",         "tool",
                            "tool_call_id", toolCallId,
                            "content",      result.content()));
                }
            } else {
                // Final text reply
                return Map.of(
                        "reply", message.path("content").asText("Done!"),
                        "steps", steps,
                        "type",  resultType,
                        "data",  resultData);
            }
        }
        return Map.of("reply", "Task complete!", "steps", steps, "type", "text", "data", Map.of());
    }

    // ── Tool dispatcher ──────────────────────────────────────────────────────

    private ToolResult executeTool(String name, JsonNode args, String city) {
        try {
            return switch (name) {
                case "search_movies"       -> searchMovies(args);
                case "search_events"       -> searchEvents(args, city);
                case "search_sports"       -> searchSports(args);
                case "get_show_timings"    -> getShowTimings(args, city);
                case "get_seat_categories" -> getSeatCategories(args);
                case "confirm_booking"     -> confirmBooking(args, city);
                default -> new ToolResult("{\"error\":\"unknown tool\"}", null, Map.of());
            };
        } catch (Exception e) {
            return new ToolResult("{\"error\":\"" + e.getMessage() + "\"}", null, Map.of());
        }
    }

    // ── Individual tools ─────────────────────────────────────────────────────

    private ToolResult searchMovies(JsonNode args) throws Exception {
        String genre  = args.has("genre")    ? args.get("genre").asText("").toLowerCase()    : "";
        String lang   = args.has("language") ? args.get("language").asText("").toLowerCase() : "";
        String format = args.has("format")   ? args.get("format").asText("").toLowerCase()   : "";

        String json = openAIService.askOpenAI("movies-en-all",
                "You are a real-time Indian cinema database. Respond with valid JSON only.",
                """
                Generate a JSON object with key "movies" containing 14 movies currently showing
                in Indian cinemas in April 2026. Include Bollywood, Hollywood, South Indian.
                Each movie: id (number), title, genre (array), language, languages (array),
                duration (string), certification, director, cast (array of 3), imdbRating,
                description (2 sentences), releaseDate, format (array like ["2D","3D","IMAX"]),
                votes, bgColor. Return only JSON.
                """);

        JsonNode root = mapper.readTree(json);
        List<Object> movies = new ArrayList<>();
        for (JsonNode m : root.path("movies")) {
            if (!genre.isEmpty()) {
                boolean ok = false;
                for (JsonNode g : m.path("genre")) { if (g.asText("").toLowerCase().contains(genre)) { ok = true; break; } }
                if (!ok) continue;
            }
            if (!lang.isEmpty()) {
                boolean ok = false;
                for (JsonNode l : m.path("languages")) { if (l.asText("").toLowerCase().contains(lang)) { ok = true; break; } }
                if (!ok) continue;
            }
            if (!format.isEmpty()) {
                boolean ok = false;
                for (JsonNode f : m.path("format")) { if (f.asText("").toLowerCase().contains(format)) { ok = true; break; } }
                if (!ok) continue;
            }
            movies.add(mapper.convertValue(m, Map.class));
            if (movies.size() >= 4) break;
        }

        String content = mapper.writeValueAsString(Map.of("movies", movies, "count", movies.size()));
        return new ToolResult(content, "movies", Map.of("items", movies));
    }

    private ToolResult searchEvents(JsonNode args, String city) throws Exception {
        String c = args.has("city") ? args.get("city").asText(city) : city;
        String cat = args.has("category") ? args.get("category").asText("") : "";

        String json = openAIService.askOpenAI("events-" + c,
                "You are an Indian live events database. Respond with valid JSON only.",
                String.format("""
                Generate JSON with key "events" containing 12 upcoming events in Indian cities
                in April-May 2026, focused on %s. Include concerts, comedy, festivals, cultural.
                Each: id, title, category, artist, venue, city, date, time, duration,
                price (min/max), description, tags (array), language, ageLimit, availableSeats.
                Return only JSON.
                """, c));

        JsonNode root = mapper.readTree(json);
        List<Object> items = new ArrayList<>();
        for (JsonNode e : root.path("events")) {
            if (!cat.isEmpty() && !e.path("category").asText("").equalsIgnoreCase(cat)) continue;
            items.add(mapper.convertValue(e, Map.class));
            if (items.size() >= 4) break;
        }
        String content = mapper.writeValueAsString(Map.of("events", items));
        return new ToolResult(content, "events", Map.of("items", items));
    }

    private ToolResult searchSports(JsonNode args) throws Exception {
        String sport = args.has("sport") ? args.get("sport").asText("").toLowerCase() : "";

        String json = openAIService.askOpenAI("sports-india",
                "You are an Indian sports events database. Respond with valid JSON only.",
                """
                Generate JSON with key "sports" containing 14 upcoming sports events in India
                for April-May 2026. Include IPL, ISL, PKL, badminton, tennis, wrestling.
                Each: id, title, sport, league, teams (array of 2), venue, city, date, time,
                price (min/max), description, category, availableSeats, tags. Return only JSON.
                """);

        JsonNode root = mapper.readTree(json);
        List<Object> items = new ArrayList<>();
        for (JsonNode s : root.path("sports")) {
            if (!sport.isEmpty() && !s.path("sport").asText("").toLowerCase().contains(sport)) continue;
            items.add(mapper.convertValue(s, Map.class));
            if (items.size() >= 4) break;
        }
        String content = mapper.writeValueAsString(Map.of("sports", items));
        return new ToolResult(content, "sports", Map.of("items", items));
    }

    private ToolResult getShowTimings(JsonNode args, String city) throws Exception {
        String title = args.path("movie_title").asText("the movie");
        String date  = args.path("date").asText("today");
        String key   = "timings-" + title.replaceAll("\\s+", "-").toLowerCase() + "-" + date;

        String json = openAIService.askOpenAI(key,
                "You are a cinema show timings database. Respond with valid JSON only.",
                String.format("""
                Generate show timings for "%s" in %s for %s.
                Return JSON: { "movieTitle": "%s", "date": "%s", "timings": [
                  { "theatreId": number, "theatre": "PVR/INOX/Cinepolis name", "area": "locality in %s",
                    "shows": [
                      {"id": number, "time": "H:MM AM/PM", "format": "2D|3D|IMAX", "price": number, "seatsAvailable": number}
                    ]
                  }
                ]}
                Include 3 theatres with 2-3 shows each. Prices: 2D=200-350, 3D=350-500, IMAX=500-700.
                Return only JSON.
                """, title, city, date, title, date, city));

        JsonNode root = mapper.readTree(json);
        Map<String, Object> data = mapper.convertValue(root, Map.class);
        return new ToolResult(json, "timings", data);
    }

    private ToolResult getSeatCategories(JsonNode args) throws Exception {
        String title = args.path("title").asText("Show");
        String type  = args.path("event_type").asText("movie");

        List<Map<String, Object>> cats = switch (type) {
            case "sport" -> List.of(
                    Map.of("id","vip",     "label","VIP Box",       "price",2500,"icon","👑","desc","Premium view + lounge access"),
                    Map.of("id","gold",    "label","Grand Stand",    "price",1200,"icon","⭐","desc","Covered stand, excellent sightlines"),
                    Map.of("id","silver",  "label","Pavilion",       "price",600, "icon","🎟️","desc","Open stand, great atmosphere"),
                    Map.of("id","general", "label","General Stand",  "price",300, "icon","🏟️","desc","Budget-friendly, join the crowd"));
            case "play"  -> List.of(
                    Map.of("id","vip",     "label","Royal Circle",   "price",1500,"icon","👑","desc","Front-centre premium seats"),
                    Map.of("id","gold",    "label","Dress Circle",   "price",900, "icon","⭐","desc","Elevated prime view"),
                    Map.of("id","silver",  "label","Stalls",         "price",500, "icon","🎭","desc","Ground floor seating"),
                    Map.of("id","general", "label","Upper Circle",   "price",250, "icon","🎟️","desc","Budget balcony seating"));
            case "event" -> List.of(
                    Map.of("id","vip",     "label","VIP / Backstage","price",3000,"icon","👑","desc","Front row + artist meet & greet"),
                    Map.of("id","gold",    "label","Premium",        "price",1500,"icon","⭐","desc","Reserved seating, best sound zone"),
                    Map.of("id","silver",  "label","Standard",       "price",800, "icon","🎟️","desc","Great view, comfortable standing"),
                    Map.of("id","general", "label","General",        "price",400, "icon","🎶","desc","Budget-friendly admission"));
            default      -> List.of( // movie
                    Map.of("id","recliner","label","Recliner",       "price",550, "icon","🛋️","desc","Luxury recliner seats"),
                    Map.of("id","gold",    "label","Gold",           "price",350, "icon","⭐","desc","Best seats, middle rows"),
                    Map.of("id","silver",  "label","Silver",         "price",250, "icon","🎟️","desc","Standard comfortable seats"),
                    Map.of("id","general", "label","General",        "price",180, "icon","🎬","desc","Budget seats at the front"));
        };

        String content = mapper.writeValueAsString(Map.of("categories", cats, "title", title, "type", type));
        return new ToolResult(content, "seats", Map.of("title", title, "type", type, "categories", cats));
    }

    private ToolResult confirmBooking(JsonNode args, String city) throws Exception {
        String title    = args.path("title").asText("Show");
        String venue    = args.path("venue").asText("Theatre");
        String time     = args.path("time").asText("7:00 PM");
        String seatCat  = args.path("seat_category").asText("Silver");
        int    count    = args.path("count").asInt(1);
        int    price    = args.path("price_per_ticket").asInt(300);
        int    conv     = 30 * count;
        int    total    = price * count + conv;
        String bookId   = "BMS" + (1000000 + (int)(Math.random() * 8999999));

        Map<String, Object> booking = new LinkedHashMap<>();
        booking.put("bookingId",     bookId);
        booking.put("title",         title);
        booking.put("venue",         venue);
        booking.put("city",          city);
        booking.put("time",          time);
        booking.put("seatCategory",  seatCat);
        booking.put("count",         count);
        booking.put("pricePerTicket",price);
        booking.put("convenience",   conv);
        booking.put("total",         total);
        booking.put("status",        "CONFIRMED");

        String content = mapper.writeValueAsString(booking);
        return new ToolResult(content, "booking_confirmed", booking);
    }

    // ── Tool definitions for OpenAI ──────────────────────────────────────────

    private List<Map<String, Object>> buildTools() {
        return List.of(
            tool("search_movies", "Search movies currently showing in Indian cinemas",
                Map.of(
                    "genre",    p("string","Genre: Action, Comedy, Drama, Thriller, Sci-Fi, Romance, Horror"),
                    "language", p("string","Language: Hindi, English, Tamil, Telugu, Kannada, Malayalam"),
                    "format",   p("string","Format: 2D, 3D, IMAX")),
                List.of()),

            tool("search_events", "Search live events: concerts, comedy shows, festivals",
                Map.of(
                    "city",     p("string","Indian city name"),
                    "category", p("string","Concert, Comedy, Festival, Cultural")),
                List.of()),

            tool("search_sports", "Search sports matches and tournaments in India",
                Map.of("sport", p("string","Cricket, Football, Kabaddi, Badminton, Tennis, Wrestling")),
                List.of()),

            tool("get_show_timings", "Get theatre showtimes for a selected movie",
                Map.of(
                    "movie_title", p("string","Exact movie title"),
                    "date",        p("string","today, tomorrow, or YYYY-MM-DD")),
                List.of("movie_title")),

            tool("get_seat_categories", "Get seating categories and prices for a movie, event, sport, or play",
                Map.of(
                    "title",      p("string","Movie or event title"),
                    "event_type", p("string","movie, event, sport, or play")),
                List.of("title","event_type")),

            tool("confirm_booking", "Confirm and complete a ticket booking after user approval",
                Map.of(
                    "title",           p("string","Title of movie or event"),
                    "venue",           p("string","Theatre or venue name"),
                    "time",            p("string","Show time"),
                    "seat_category",   p("string","Seat category label (e.g. Gold, Silver, VIP)"),
                    "count",           Map.of("type","integer","description","Number of tickets"),
                    "price_per_ticket",Map.of("type","integer","description","Price per ticket in INR")),
                List.of("title","venue","time","seat_category","count","price_per_ticket"))
        );
    }

    private Map<String, Object> tool(String name, String desc,
                                      Map<String, Object> props, List<String> required) {
        return Map.of("type","function","function",Map.of(
                "name", name, "description", desc,
                "parameters", Map.of("type","object","properties",props,"required",required)));
    }

    private Map<String, Object> p(String type, String desc) {
        return Map.of("type", type, "description", desc);
    }

    private String stepLabel(String tool) {
        return switch (tool) {
            case "search_movies"       -> "Searching movies…";
            case "search_events"       -> "Finding events…";
            case "search_sports"       -> "Looking up matches…";
            case "get_show_timings"    -> "Fetching showtimes…";
            case "get_seat_categories" -> "Checking seat availability…";
            case "confirm_booking"     -> "Confirming your booking…";
            default                    -> "Processing…";
        };
    }

    private record ToolResult(String content, String type, Map<String, Object> data) {}
}
