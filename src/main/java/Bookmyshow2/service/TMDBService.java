package Bookmyshow2.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TMDBService {

    @Value("${tmdb.api.key:}")
    private String apiKey;

    private final RestTemplate rest   = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, Object[]> cache = new ConcurrentHashMap<>();

    private static final String TMDB   = "https://api.themoviedb.org/3";
    private static final String W500   = "https://image.tmdb.org/t/p/w500";
    private static final String W1280  = "https://image.tmdb.org/t/p/w1280";
    private static final long   TTL_MS = 2 * 60 * 60 * 1000L; // 2 hours

    private static final Map<Integer, String> GENRE_MAP = new HashMap<>();
    private static final Map<String, String>  LANG_MAP  = new HashMap<>();

    static {
        GENRE_MAP.put(28, "Action");    GENRE_MAP.put(12, "Adventure");
        GENRE_MAP.put(16, "Animation"); GENRE_MAP.put(35, "Comedy");
        GENRE_MAP.put(80, "Crime");     GENRE_MAP.put(99, "Documentary");
        GENRE_MAP.put(18, "Drama");     GENRE_MAP.put(10751, "Family");
        GENRE_MAP.put(14, "Fantasy");   GENRE_MAP.put(36, "History");
        GENRE_MAP.put(27, "Horror");    GENRE_MAP.put(10402, "Music");
        GENRE_MAP.put(9648, "Mystery"); GENRE_MAP.put(10749, "Romance");
        GENRE_MAP.put(878, "Sci-Fi");   GENRE_MAP.put(53, "Thriller");
        GENRE_MAP.put(10752, "War");    GENRE_MAP.put(37, "Western");

        LANG_MAP.put("hi", "Hindi");    LANG_MAP.put("en", "English");
        LANG_MAP.put("ta", "Tamil");    LANG_MAP.put("te", "Telugu");
        LANG_MAP.put("kn", "Kannada"); LANG_MAP.put("ml", "Malayalam");
        LANG_MAP.put("mr", "Marathi"); LANG_MAP.put("bn", "Bengali");
        LANG_MAP.put("pa", "Punjabi");
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("your_");
    }

    // ── Public API ────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getNowPlaying() {
        return fetchList("now-playing",
            TMDB + "/movie/now_playing?api_key=" + apiKey + "&language=en-US&region=IN&page=1");
    }

    public List<Map<String, Object>> getUpcoming() {
        return fetchList("upcoming",
            TMDB + "/movie/upcoming?api_key=" + apiKey + "&language=en-US&region=IN&page=1");
    }

    public Map<String, Object> getMovieDetails(long id) {
        String key = "detail-" + id;
        Object[] hit = cache.get(key);
        if (hit != null && System.currentTimeMillis() - (long) hit[1] < TTL_MS)
            return cast(hit[0]);
        try {
            String url  = TMDB + "/movie/" + id + "?api_key=" + apiKey + "&append_to_response=credits";
            String body = rest.getForObject(url, String.class);
            Map<String, Object> movie = parseDetails(mapper.readTree(body));
            cache.put(key, new Object[]{movie, System.currentTimeMillis()});
            return movie;
        } catch (Exception e) { return null; }
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchList(String cacheKey, String url) {
        Object[] hit = cache.get(cacheKey);
        if (hit != null && System.currentTimeMillis() - (long) hit[1] < TTL_MS)
            return (List<Map<String, Object>>) hit[0];
        try {
            String body = rest.getForObject(url, String.class);
            List<Map<String, Object>> list = new ArrayList<>();
            for (JsonNode n : mapper.readTree(body).path("results"))
                list.add(parseBasic(n));
            cache.put(cacheKey, new Object[]{list, System.currentTimeMillis()});
            return list;
        } catch (Exception e) { return List.of(); }
    }

    private Map<String, Object> parseBasic(JsonNode n) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",          n.path("id").asLong());
        m.put("title",       n.path("title").asText(n.path("original_title").asText("Unknown")));
        m.put("description", n.path("overview").asText(""));

        String poster   = n.path("poster_path").asText("");
        String backdrop = n.path("backdrop_path").asText("");
        m.put("posterUrl",   poster.isEmpty()   ? null : W500  + poster);
        m.put("backdropUrl", backdrop.isEmpty() ? null : W1280 + backdrop);

        m.put("releaseDate", n.path("release_date").asText(""));

        double rating = Math.round(n.path("vote_average").asDouble(0) * 10.0) / 10.0;
        m.put("imdbRating", rating);
        m.put("votes",      formatVotes(n.path("vote_count").asInt(0)));

        List<String> genres = new ArrayList<>();
        for (JsonNode g : n.path("genre_ids")) {
            String name = GENRE_MAP.get(g.asInt());
            if (name != null) genres.add(name);
        }
        m.put("genre", genres.isEmpty() ? List.of("Drama") : genres);

        String origLang = n.path("original_language").asText("en");
        m.put("language",  LANG_MAP.getOrDefault(origLang, "English"));
        m.put("languages", indianDubs(origLang));

        double pop = n.path("popularity").asDouble(0);
        m.put("format",        formats(pop));
        m.put("certification", "UA");
        m.put("bgColor",       bgColor(n.path("id").asInt()));
        return m;
    }

    private Map<String, Object> parseDetails(JsonNode n) {
        Map<String, Object> m = parseBasic(n);

        int runtime = n.path("runtime").asInt(0);
        if (runtime > 0) m.put("duration", runtime + " min");

        // Real genre names from details endpoint
        List<String> genres = new ArrayList<>();
        for (JsonNode g : n.path("genres")) genres.add(g.path("name").asText());
        if (!genres.isEmpty()) m.put("genre", genres);

        // Spoken languages
        List<String> langs = new ArrayList<>();
        for (JsonNode l : n.path("spoken_languages")) {
            String name = l.path("english_name").asText(l.path("name").asText(""));
            if (!name.isEmpty()) langs.add(name);
        }
        if (!langs.isEmpty()) m.put("languages", langs);

        // Cast (top 8)
        List<String> cast        = new ArrayList<>();
        List<Map<String, Object>> castDetails = new ArrayList<>();
        JsonNode castArr = n.path("credits").path("cast");
        for (int i = 0; i < Math.min(8, castArr.size()); i++) {
            JsonNode c    = castArr.get(i);
            String  name  = c.path("name").asText("");
            cast.add(name);
            String profilePath = c.path("profile_path").asText("");
            Map<String, Object> cm = new LinkedHashMap<>();
            cm.put("name",       name);
            cm.put("character",  c.path("character").asText(""));
            cm.put("profileUrl", profilePath.isEmpty() ? null : W500 + profilePath);
            castDetails.add(cm);
        }
        m.put("cast",        cast);
        m.put("castDetails", castDetails);

        // Director
        for (JsonNode crew : n.path("credits").path("crew")) {
            if ("Director".equals(crew.path("job").asText())) {
                m.put("director", crew.path("name").asText(""));
                break;
            }
        }
        return m;
    }

    private List<String> indianDubs(String lang) {
        return switch (lang) {
            case "hi" -> List.of("Hindi", "English");
            case "en" -> List.of("English", "Hindi", "Tamil", "Telugu");
            case "ta" -> List.of("Tamil", "Hindi", "Telugu", "English");
            case "te" -> List.of("Telugu", "Hindi", "Tamil", "English");
            case "kn" -> List.of("Kannada", "Hindi", "English");
            case "ml" -> List.of("Malayalam", "Hindi", "English");
            default   -> List.of(LANG_MAP.getOrDefault(lang, "English"), "Hindi");
        };
    }

    private List<String> formats(double popularity) {
        if (popularity > 100) return List.of("2D", "3D", "IMAX");
        if (popularity > 40)  return List.of("2D", "3D");
        return List.of("2D");
    }

    private String formatVotes(int count) {
        if (count >= 1_000_000) return String.format("%.1fM", count / 1_000_000.0);
        if (count >= 1_000)     return String.format("%.0fK", count / 1_000.0);
        return String.valueOf(count);
    }

    private String bgColor(int id) {
        String[] colors = {"#1a0a2e","#0a1a2e","#0a2010","#1a0a10","#1a1a0a","#0a0a2e","#2e0a0a"};
        return colors[Math.abs(id) % colors.length];
    }

    @SuppressWarnings("unchecked")
    private <T> T cast(Object o) { return (T) o; }
}
