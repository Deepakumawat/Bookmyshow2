package Bookmyshow2.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TicketmasterService {

    @Value("${ticketmaster.api.key:}")
    private String apiKey;

    private final RestTemplate rest   = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, Object[]> cache = new ConcurrentHashMap<>();

    private static final String BASE   = "https://app.ticketmaster.com/discovery/v2";
    private static final long   TTL_MS = 2 * 60 * 60 * 1000L; // 2 hours

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    // ── Public API ────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getEvents(String city) {
        String encoded = encode(city);
        String url = BASE + "/events.json?apikey=" + apiKey
                + "&countryCode=IN&city=" + encoded
                + "&size=20&sort=date,asc";
        return fetchAndParse("events-" + city, url, "event");
    }

    public List<Map<String, Object>> getSports() {
        String url = BASE + "/events.json?apikey=" + apiKey
                + "&countryCode=IN&segmentName=Sports&size=20&sort=date,asc";
        return fetchAndParse("sports-IN", url, "sport");
    }

    public List<Map<String, Object>> getPlays(String city) {
        String encoded = encode(city);
        String url = BASE + "/events.json?apikey=" + apiKey
                + "&countryCode=IN&segmentName=Arts+%26+Theatre&city=" + encoded
                + "&size=20&sort=date,asc";
        return fetchAndParse("plays-" + city, url, "play");
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchAndParse(String cacheKey, String url, String type) {
        Object[] hit = cache.get(cacheKey);
        if (hit != null && System.currentTimeMillis() - (long) hit[1] < TTL_MS)
            return (List<Map<String, Object>>) hit[0];
        try {
            String body = rest.getForObject(url, String.class);
            JsonNode root = mapper.readTree(body);
            JsonNode events = root.path("_embedded").path("events");
            if (!events.isArray() || events.size() == 0) return List.of();

            List<Map<String, Object>> list = new ArrayList<>();
            for (JsonNode e : events) {
                Map<String, Object> item = switch (type) {
                    case "sport" -> parseSport(e);
                    case "play"  -> parsePlay(e);
                    default      -> parseEvent(e);
                };
                if (item != null) list.add(item);
            }
            cache.put(cacheKey, new Object[]{list, System.currentTimeMillis()});
            return list;
        } catch (Exception ex) {
            return List.of();
        }
    }

    private Map<String, Object> parseEvent(JsonNode e) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",    e.path("id").asText());
        m.put("title", e.path("name").asText("Unknown Event"));

        JsonNode cls = e.path("classifications").path(0);
        m.put("category", cls.path("segment").path("name").asText("Concert"));
        m.put("artist",   cls.path("genre").path("name").asText("Live Event"));

        JsonNode venue = e.path("_embedded").path("venues").path(0);
        m.put("venue", venue.path("name").asText("Venue TBA"));
        m.put("city",  venue.path("city").path("name").asText("India"));

        JsonNode dates = e.path("dates").path("start");
        m.put("date", dates.path("localDate").asText("TBA"));
        m.put("time", formatTime(dates.path("localTime").asText("19:00:00")));

        m.put("price", priceRange(e));
        m.put("image", bestImage(e));
        m.put("description", e.path("name").asText("") + " — live in India.");
        m.put("tags",  List.of(cls.path("segment").path("name").asText("Event"),
                               cls.path("genre").path("name").asText("Live")));
        m.put("language",  "Hindi/English");
        m.put("ageLimit",  "All ages");
        m.put("availableSeats", 200);
        return m;
    }

    private Map<String, Object> parseSport(JsonNode e) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",    e.path("id").asText());
        m.put("title", e.path("name").asText("Sports Event"));

        JsonNode cls = e.path("classifications").path(0);
        String sport = cls.path("genre").path("name").asText(
                       cls.path("subGenre").path("name").asText("Sports"));
        m.put("sport",    sport);
        m.put("league",   cls.path("subType").path("name").asText("Live Sports"));
        m.put("teams",    List.of(e.path("name").asText("Team A"), "vs Opponent"));
        m.put("category", "Team Sport");

        JsonNode venue = e.path("_embedded").path("venues").path(0);
        m.put("venue", venue.path("name").asText("Stadium TBA"));
        m.put("city",  venue.path("city").path("name").asText("India"));

        JsonNode dates = e.path("dates").path("start");
        m.put("date", dates.path("localDate").asText("TBA"));
        m.put("time", formatTime(dates.path("localTime").asText("19:00:00")));

        m.put("price", priceRange(e));
        m.put("image", bestImage(e));
        m.put("description", "Live " + sport + " action in India.");
        m.put("tags", List.of(sport, "Live", "India"));
        m.put("availableSeats", 500);
        return m;
    }

    private Map<String, Object> parsePlay(JsonNode e) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",    e.path("id").asText());
        m.put("title", e.path("name").asText("Theatre Performance"));

        JsonNode cls = e.path("classifications").path(0);
        m.put("genre",    cls.path("genre").path("name").asText("Drama"));
        m.put("language", "English/Hindi");
        m.put("director", "");
        m.put("cast",     List.of());

        JsonNode venue = e.path("_embedded").path("venues").path(0);
        m.put("venue", venue.path("name").asText("Theatre TBA"));
        m.put("city",  venue.path("city").path("name").asText("India"));

        JsonNode dates = e.path("dates").path("start");
        m.put("date", dates.path("localDate").asText("TBA"));
        m.put("time", formatTime(dates.path("localTime").asText("18:30:00")));

        m.put("duration", "2 hours");
        m.put("price",    priceRange(e));
        m.put("image",    bestImage(e));
        m.put("description", e.path("name").asText("") + " — live theatre performance.");
        m.put("ageLimit", "All ages");
        m.put("availableSeats", 150);
        return m;
    }

    private Map<String, Object> priceRange(JsonNode e) {
        JsonNode pr = e.path("priceRanges").path(0);
        Map<String, Object> price = new LinkedHashMap<>();
        price.put("min", pr.isMissingNode() ? 500  : (int) pr.path("min").asDouble(500));
        price.put("max", pr.isMissingNode() ? 2000 : (int) pr.path("max").asDouble(2000));
        return price;
    }

    private String bestImage(JsonNode e) {
        String best = null;
        int bestWidth = 0;
        for (JsonNode img : e.path("images")) {
            int w = img.path("width").asInt(0);
            if (w > bestWidth) { bestWidth = w; best = img.path("url").asText(null); }
        }
        return best != null ? best : "https://picsum.photos/seed/tm-" + e.path("id").asText("ev") + "/400/225";
    }

    private String formatTime(String localTime) {
        try {
            String[] parts = localTime.split(":");
            int hour = Integer.parseInt(parts[0]);
            int min  = Integer.parseInt(parts[1]);
            String ampm = hour >= 12 ? "PM" : "AM";
            int h12 = hour % 12; if (h12 == 0) h12 = 12;
            return String.format("%d:%02d %s", h12, min, ampm);
        } catch (Exception ex) { return localTime; }
    }

    private String encode(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }
}
