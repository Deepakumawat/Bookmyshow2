package Bookmyshow2.repositories;

import Bookmyshow2.models.Seat;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatsRepository extends JpaRepository<Seat, Integer> {

  // List<Seat> findAllById(List<Integer> seatIds);

    @Override
    @NotNull
    List<Seat> findAllById(@NotNull Iterable<Integer> integers);
}