package Bookmyshow2.controllers;

import Bookmyshow2.dtos.BookTicketRequestDTO;
import Bookmyshow2.dtos.BookTicketResponseDTO;
import Bookmyshow2.models.Ticket;
import Bookmyshow2.models.User;
import Bookmyshow2.services.TicketService;
import Bookmyshow2.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UserService userService;

    @Autowired
    public TicketController(TicketService ticketService, UserService userService) {
        this.ticketService = ticketService;
        this.userService = userService;
    }

    /**
     * POST /api/tickets/book - Book a ticket
     */
    @PostMapping("/book")
    public ResponseEntity<BookTicketResponseDTO> bookTicket(@RequestBody BookTicketRequestDTO request) {
        try {
            User user = userService.getUserById(request.getUserId());
            Ticket ticket = ticketService.bookTicket(
                    request.getShowId(),
                    request.getSeatIds(),
                    user
            );
            return ResponseEntity.ok(BookTicketResponseDTO.getSuccessDTO(ticket));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BookTicketResponseDTO.getFailureDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BookTicketResponseDTO.getFailureDTO("Booking failed: " + e.getMessage()));
        }
    }

    /**
     * GET /api/tickets/{id} - Get ticket details
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookTicketResponseDTO> getTicket(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            return ResponseEntity.ok(BookTicketResponseDTO.getSuccessDTO(ticket));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(BookTicketResponseDTO.getFailureDTO(e.getMessage()));
        }
    }

    /**
     * GET /api/tickets/show/{showId} - Get all tickets for a show
     */
    @GetMapping("/show/{showId}")
    public ResponseEntity<List<Ticket>> getShowTickets(@PathVariable Long showId) {
        try {
            List<Ticket> tickets = ticketService.getShowTickets(showId);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /api/tickets/{id} - Cancel ticket
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelTicket(@PathVariable Long id) {
        try {
            ticketService.cancelTicket(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}