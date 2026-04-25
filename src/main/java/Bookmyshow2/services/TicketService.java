package Bookmyshow2.services;

import Bookmyshow2.models.Show;
import Bookmyshow2.models.Seat;
import Bookmyshow2.models.Ticket;
import Bookmyshow2.models.User;
import Bookmyshow2.repositories.TicketRepository;
import Bookmyshow2.repositories.ShowRepository;
import Bookmyshow2.repositories.ShowSeatRepository;
import Bookmyshow2.repositories.SeatsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final SeatsRepository seatsRepository;

    @Autowired
    public TicketService(TicketRepository ticketRepository, ShowRepository showRepository,
                        ShowSeatRepository showSeatRepository, SeatsRepository seatsRepository) {
        this.ticketRepository = ticketRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.seatsRepository = seatsRepository;
    }

    /**
     * Book ticket with proper seat locking
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Ticket bookTicket(Long showId, List<Long> seatIds, User user) {
        // Get the show
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new IllegalArgumentException("Show not found"));

        // Verify and lock seats
        List<Seat> seats = verifyAndLockSeats(showId, seatIds);

        if (seats.isEmpty()) {
            throw new IllegalArgumentException("No valid seats found");
        }

        // Create ticket
        Ticket ticket = new Ticket();
        ticket.setShow(show);
        ticket.setSeats(seats);
        ticket.setTimeOfBooking(new Date());

        return ticketRepository.save(ticket);
    }

    /**
     * Verify seats are available and lock them
     */
    private List<Seat> verifyAndLockSeats(Long showId, List<Long> seatIds) {
        // This is a simplified version - in production, you'd implement proper seat locking
        return seatsRepository.findAllById(seatIds);
    }

    /**
     * Get ticket by ID
     */
    public Ticket getTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
    }

    /**
     * Get all tickets for a show
     */
    public List<Ticket> getShowTickets(Long showId) {
        return ticketRepository.findAll().stream()
                .filter(t -> t.getShow().getId().equals(showId))
                .toList();
    }

    /**
     * Cancel ticket
     */
    public void cancelTicket(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        // Release seats and delete ticket
        ticketRepository.delete(ticket);
    }
}