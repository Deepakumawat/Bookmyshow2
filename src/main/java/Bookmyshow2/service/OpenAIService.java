package Bookmyshow2.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OpenAIService {

    @Value("${openai.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // Simple in-memory cache: key -> {data, expiresAt}
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private static final long CACHE_TTL_MS = 3600_000; // 1 hour

    public void clearCache() {
        cache.clear();
    }

    public String askOpenAI(String cacheKey, String systemPrompt, String userPrompt) {
        // Include today's date so cache refreshes daily instead of serving stale old data
        String dailyKey = cacheKey + "-" + java.time.LocalDate.now();
        CacheEntry entry = cache.get(dailyKey);
        if (entry != null && Instant.now().toEpochMilli() < entry.expiresAt) {
            return entry.data;
        }

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("OpenAI API key not configured. Add OPENAI_API_KEY to .env");
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
            JsonNode root = mapper.readTree(response.getBody());
            String content = root.path("choices").get(0).path("message").path("content").asText();
            cache.put(dailyKey, new CacheEntry(content, Instant.now().toEpochMilli() + CACHE_TTL_MS));
            return content;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse OpenAI response: " + e.getMessage());
        }
    }

    private record CacheEntry(String data, long expiresAt) {}
}
