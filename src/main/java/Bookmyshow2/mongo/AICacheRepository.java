package Bookmyshow2.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AICacheRepository extends MongoRepository<AICacheDocument, String> {
    Optional<AICacheDocument> findByCacheKey(String cacheKey);
    void deleteByCacheKey(String cacheKey);
}
