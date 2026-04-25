package Bookmyshow2.repositories;

import Bookmyshow2.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByLanguageIgnoreCase(String language);
    List<Movie> findByGenreContainingIgnoreCase(String genre);
}
