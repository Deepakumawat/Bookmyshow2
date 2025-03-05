package Bookmyshow2.repositories;

import Bookmyshow2.models.Ticket;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket , Integer> {

    @NotNull Ticket save(@NotNull Ticket ticket);

}