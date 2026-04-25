package Bookmyshow2.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MongoTicketRepository extends MongoRepository<TicketDocument, String> {
    List<TicketDocument> findByUserId(String userId);
    List<TicketDocument> findByUserEmail(String email);
    List<TicketDocument> findByMovieTitle(String movieTitle);
    List<TicketDocument> findByCity(String city);
    List<TicketDocument> findByStatus(String status);
    long countByMovieTitle(String movieTitle);
    long countByCity(String city);
}
