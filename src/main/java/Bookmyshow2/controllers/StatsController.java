package Bookmyshow2.controllers;

import Bookmyshow2.mongo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired private MongoUserRepository   userRepo;
    @Autowired private MongoTicketRepository ticketRepo;
    @Autowired private MongoTemplate         mongoTemplate;

    // ── Platform Overview ─────────────────────────────────────────────────
    @GetMapping("/overview")
    public ResponseEntity<?> overview() {
        long totalUsers   = userRepo.count();
        long totalTickets = ticketRepo.count();
        List<TicketDocument> allTickets = ticketRepo.findAll();

        double totalRevenue = allTickets.stream().mapToDouble(TicketDocument::getTotalAmount).sum();
        long   confirmed    = allTickets.stream().filter(t -> "CONFIRMED".equals(t.getStatus())).count();
        long   cancelled    = allTickets.stream().filter(t -> "CANCELLED".equals(t.getStatus())).count();

        // Top 5 movies by booking count
        Map<String, Long> movieCounts = allTickets.stream()
                .collect(Collectors.groupingBy(TicketDocument::getMovieTitle, Collectors.counting()));
        List<Map<String, Object>> topMovies = movieCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> { Map<String, Object> m = new LinkedHashMap<>(); m.put("movie", e.getKey()); m.put("bookings", e.getValue()); return m; })
                .collect(Collectors.toList());

        // Top 5 cities
        Map<String, Long> cityCounts = allTickets.stream()
                .filter(t -> t.getCity() != null)
                .collect(Collectors.groupingBy(TicketDocument::getCity, Collectors.counting()));
        List<Map<String, Object>> topCities = cityCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> { Map<String, Object> m = new LinkedHashMap<>(); m.put("city", e.getKey()); m.put("bookings", e.getValue()); return m; })
                .collect(Collectors.toList());

        // Membership breakdown
        Map<String, Object> membership = new LinkedHashMap<>();
        membership.put("BRONZE",   userRepo.countByMembershipTier("BRONZE"));
        membership.put("SILVER",   userRepo.countByMembershipTier("SILVER"));
        membership.put("GOLD",     userRepo.countByMembershipTier("GOLD"));
        membership.put("PLATINUM", userRepo.countByMembershipTier("PLATINUM"));

        // Seat type breakdown
        Map<String, Long> seatTypes = allTickets.stream()
                .filter(t -> t.getSeatType() != null)
                .collect(Collectors.groupingBy(TicketDocument::getSeatType, Collectors.counting()));

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("totalUsers",    totalUsers);
        resp.put("totalTickets",  totalTickets);
        resp.put("totalRevenue",  Math.round(totalRevenue * 100.0) / 100.0);
        resp.put("confirmed",     confirmed);
        resp.put("cancelled",     cancelled);
        resp.put("avgTicketValue", totalTickets > 0 ? Math.round(totalRevenue / totalTickets) : 0);
        resp.put("topMovies",     topMovies);
        resp.put("topCities",     topCities);
        resp.put("membershipBreakdown", membership);
        resp.put("seatTypeBreakdown",   seatTypes);
        return ResponseEntity.ok(resp);
    }

    // ── All Users ─────────────────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<?> allUsers() {
        List<UserDocument> users = userRepo.findAll();
        List<Map<String, Object>> result = users.stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id",             u.getId());
            m.put("name",           u.getName());
            m.put("email",          u.getEmail());
            m.put("city",           u.getCity());
            m.put("membershipTier", u.getMembershipTier());
            m.put("totalBookings",  u.getTotalBookings());
            m.put("totalSpent",     u.getTotalSpent());
            m.put("createdAt",      u.getCreatedAt());
            m.put("lastLoginAt",    u.getLastLoginAt());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("total", users.size(), "users", result));
    }

    // ── All Tickets ───────────────────────────────────────────────────────
    @GetMapping("/tickets")
    public ResponseEntity<?> allTickets(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String movie,
            @RequestParam(required = false) String city) {
        List<TicketDocument> tickets;
        if (userId != null)     tickets = ticketRepo.findByUserId(userId);
        else if (movie != null) tickets = ticketRepo.findByMovieTitle(movie);
        else if (city  != null) tickets = ticketRepo.findByCity(city);
        else                    tickets = ticketRepo.findAll();
        return ResponseEntity.ok(Map.of("total", tickets.size(), "tickets", tickets));
    }

    // ── User Tickets by Email ─────────────────────────────────────────────
    @GetMapping("/my-bookings")
    public ResponseEntity<?> myBookings(@RequestParam String email) {
        List<TicketDocument> tickets = ticketRepo.findByUserEmail(email);
        double totalSpent = tickets.stream().mapToDouble(TicketDocument::getTotalAmount).sum();
        return ResponseEntity.ok(Map.of(
            "email",      email,
            "total",      tickets.size(),
            "totalSpent", Math.round(totalSpent),
            "tickets",    tickets
        ));
    }
}
