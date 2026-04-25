package Bookmyshow2.repositories;

import Bookmyshow2.models.Show;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {

    @Override
    @NotNull
    Optional<Show> findById(@NotNull Long showId);
}