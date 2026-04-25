package Bookmyshow2.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MongoUserRepository extends MongoRepository<UserDocument, String> {
    Optional<UserDocument> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByCity(String city);
    long countByMembershipTier(String tier);
}
