package Bookmyshow2.repositories;

import Bookmyshow2.models.SeatTypeShow;
import Bookmyshow2.models.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatTypeShowRepository extends JpaRepository<SeatTypeShow, Long> {
    List<SeatTypeShow> findByShow(Show show);
}
