package Bookmyshow2.service;

import Bookmyshow2.mongo.AICacheDocument;
import Bookmyshow2.mongo.AICacheRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OpenAIService {

    @Value("${openai.api.key:}")
    private String apiKey;

    @Autowired
    private AICacheRepository mongoCache;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // L1: in-memory cache (fast, lost on restart)
    private final Map<String, CacheEntry> memCache = new ConcurrentHashMap<>();

    private static final String OPENAI_URL  = "https://api.openai.com/v1/chat/completions";
    private static final long   MEM_TTL_MS  = 60 * 60 * 1000L;   // 1 hour in memory
    private static final long   MONGO_TTL_S = 24 * 60 * 60L;     // 24 hours in MongoDB

    public void clearCache() {
        memCache.clear();
    }

    public String askOpenAI(String cacheKey, String systemPrompt, String userPrompt) {
        // Key includes today's date so content refreshes daily
        String dailyKey = cacheKey + "-" + LocalDate.now();

        // 1. Check in-memory cache (fastest)
        CacheEntry mem = memCache.get(dailyKey);
        if (mem != null && Instant.now().toEpochMilli() < mem.expiresAt) {
            return mem.data;
        }

        // 2. Check MongoDB cache (survives Render restarts)
        try {
            Optional<AICacheDocument> doc = mongoCache.findByCacheKey(dailyKey);
            if (doc.isPresent() && doc.get().getExpiresAt().isAfter(Instant.now())) {
                String cached = doc.get().getData();
                memCache.put(dailyKey, new CacheEntry(cached, Instant.now().toEpochMilli() + MEM_TTL_MS));
                return cached;
            }
        } catch (Exception ignored) {}

        // 3. Call OpenAI API
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("OpenAI API key not configured");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", "gpt-4o-mini");
        body.put("response_format", Map.of("type", "json_object"));
        body.put("temperature", 0.7);
        body.put("max_tokens", 3000);
        body.put("messages", List.of(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userPrompt)
        ));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(OPENAI_URL, request, String.class);

        try {
            JsonNode root    = mapper.readTree(response.getBody());
            String   content = root.path("choices").get(0).path("message").path("content").asText();

            // Save to in-memory cache
            memCache.put(dailyKey, new CacheEntry(content, Instant.now().toEpochMilli() + MEM_TTL_MS));

            // Save to MongoDB cache (persists across restarts)
            try {
                mongoCache.deleteByCacheKey(dailyKey);
                mongoCache.save(new AICacheDocument(dailyKey, content,
                        Instant.now().plusSeconds(MONGO_TTL_S)));
            } catch (Exception ignored) {}

            return content;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse OpenAI response: " + e.getMessage());
        }
    }

    private record CacheEntry(String data, long expiresAt) {}
}
