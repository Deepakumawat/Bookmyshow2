package Bookmyshow2.controllers;

import Bookmyshow2.mongo.MongoTicketRepository;
import Bookmyshow2.mongo.MongoUserRepository;
import Bookmyshow2.mongo.TicketDocument;
import Bookmyshow2.mongo.UserDocument;
import Bookmyshow2.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/mongo/tickets")
public class MongoTicketController {

    @Autowired private MongoTicketRepository ticketRepo;
    @Autowired private MongoUserRepository   userRepo;
    @Autowired private EmailService emailService;

    // ── Book Ticket ───────────────────────────────────────────────────────
    @PostMapping("/book")
    public ResponseEntity<?> book(@RequestBody Map<String, Object> body) {
        try {
            String userId       = body.getOrDefault("userId",       "").toString();
            String userEmail    = body.getOrDefault("userEmail",    "").toString();
            String userName     = body.getOrDefault("userName",     "Guest").toString();
            String movieTitle   = body.getOrDefault("movieTitle",   "Unknown Movie").toString();
            String movieGenre   = body.getOrDefault("movieGenre",   "").toString();
            String theatreName  = body.getOrDefault("theatreName",  "").toString();
            String city         = body.getOrDefault("city",         "Mumbai").toString();
            String showDate     = body.getOrDefault("showDate",     "").toString();
            String showTime     = body.getOrDefault("showTime",     "").toString();
            String format       = body.getOrDefault("format",       "2D").toString();
            String seatType     = body.getOrDefault("seatType",     "GOLD").toString();
            String paymentMethod= body.getOrDefault("paymentMethod","Card").toString();

            @SuppressWarnings("unchecked")
            List<String> seats  = (List<String>) body.getOrDefault("seats", List.of());

            double baseAmount      = Double.parseDouble(body.getOrDefault("baseAmount",      "0").toString());
            double convenienceFee  = Double.parseDouble(body.getOrDefault("convenienceFee",  "30").toString());

            TicketDocument ticket = TicketDocument.create(
                userId, userEmail, userName,
                movieTitle, movieGenre, theatreName, city,
                showDate, showTime, format,
                seats, seatType, baseAmount, convenienceFee, paymentMethod
            );
            final TicketDocument saved = ticketRepo.save(ticket);

            // Update user stats in MongoDB
            if (!userId.isEmpty()) {
                userRepo.findById(userId).ifPresent(u -> {
                    u.recordBooking(saved.getTotalAmount());
                    userRepo.save(u);
                });
            } else if (!userEmail.isEmpty()) {
                userRepo.findByEmail(userEmail).ifPresent(u -> {
                    u.recordBooking(saved.getTotalAmount());
                    userRepo.save(u);
                });
            }
            ticket = saved;

            // Send confirmation email (non-fatal — booking succeeds even if email fails)
            try {
                emailService.sendBookingConfirmation(
                    userEmail, userName, movieTitle,
                    theatreName, showDate, showTime, format,
                    seats, ticket.getTotalAmount(), ticket.getId()
                );
            } catch (Exception emailEx) {
                System.out.println("[EMAIL] Skipping email: " + emailEx.getMessage());
            }

            return ResponseEntity.ok(Map.of(
                "message",     "Booking confirmed!",
                "ticketId",    ticket.getId(),
                "movie",       ticket.getMovieTitle(),
                "seats",       ticket.getSeats(),
                "totalAmount", ticket.getTotalAmount(),
                "status",      ticket.getStatus(),
                "bookedAt",    ticket.getBookedAt()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Get Ticket by ID ──────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicket(@PathVariable String id) {
        return ticketRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Cancel Ticket ─────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable String id) {
        Optional<TicketDocument> opt = ticketRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        TicketDocument t = opt.get();
        t.setStatus("CANCELLED");
        ticketRepo.save(t);
        return ResponseEntity.ok(Map.of("message", "Booking cancelled", "ticketId", id));
    }

    // ── My Bookings ───────────────────────────────────────────────────────
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> userTickets(@PathVariable String userId) {
        List<TicketDocument> tickets = ticketRepo.findByUserId(userId);
        return ResponseEntity.ok(Map.of("total", tickets.size(), "tickets", tickets));
    }

    // ── Test Email ────────────────────────────────────────────────────────
    @GetMapping("/test-email/{email}")
    public ResponseEntity<?> testEmail(@PathVariable String email) {
        try {
            emailService.sendBookingConfirmation(
                email, "Test User", "Test Movie",
                "Test Theatre", "Monday, 28 April 2026", "7:00 PM", "2D",
                List.of("A1", "A2"), 660.0, "TEST-" + System.currentTimeMillis()
            );
            return ResponseEntity.ok(Map.of("message", "Email sent to " + email));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
