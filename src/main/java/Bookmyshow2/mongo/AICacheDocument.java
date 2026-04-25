package Bookmyshow2.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "ai_cache")
public class AICacheDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private String cacheKey;

    private String data;

    @Indexed(expireAfterSeconds = 0)
    private Instant expiresAt;

    public AICacheDocument() {}

    public AICacheDocument(String cacheKey, String data, Instant expiresAt) {
        this.cacheKey  = cacheKey;
        this.data      = data;
        this.expiresAt = expiresAt;
    }

    public String getCacheKey() { return cacheKey; }
    public String getData()     { return data; }
    public Instant getExpiresAt() { return expiresAt; }
}
