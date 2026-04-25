package Bookmyshow2.repositories;

import Bookmyshow2.models.Screen;
import Bookmyshow2.models.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {
    List<Screen> findByTheatre(Theatre theatre);
}
