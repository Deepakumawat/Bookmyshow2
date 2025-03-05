package Bookmyshow2.repositories;

import Bookmyshow2.models.ShowSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowSeatRepository extends JpaRepository<ShowSeat, Integer> {

    // select * from show_seats where show_id = {show_id} and seat_id in [seat_ids] for update

}