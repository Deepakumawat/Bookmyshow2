package Bookmyshow2.controllers;

import Bookmyshow2.models.*;
import Bookmyshow2.repositories.*;
import Bookmyshow2.service.OpenAIService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ml")
public class MLController {

    @Autowired private ShowRepository showRepo;
    @Autowired private ShowSeatRepository showSeatRepo;
    @Autowired private SeatTypeShowRepository seatTypeShowRepo;
    @Autowired private MovieRepository movieRepo;
    @Autowired private TicketRepository ticketRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private OpenAIService openAIService;

    private final ObjectMapper mapper = new ObjectMapper();

    // ── In-memory view counter (simulates real-time viewers) ─────────────
    private final Map<Long, Integer> viewerCount = new java.util.concurrent.ConcurrentHashMap<>();
    private final Map<Long, Long>    lastViewTs  = new java.util.concurrent.ConcurrentHashMap<>();

    // ── 1. COLLABORATIVE FILTERING ───────────────────────────────────────
    // Pure Java cosine similarity on genre preference vectors
    @GetMapping("/collaborative-filter")
    public ResponseEntity<?> collaborativeFilter(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam(defaultValue = "6") int limit) {
        try {
            List<Movie> allMovies = movieRepo.findAll();
            List<Ticket> allTickets = ticketRepo.findAll();

            // Build genre vocabulary
            Set<String> genreSet = new LinkedHashSet<>();
            for (Movie m : allMovies) {
                if (m.getGenre() != null)
                    Arrays.stream(m.getGenre().split(","))
                          .map(String::trim).forEach(genreSet::add);
            }
            List<String> genres = new ArrayList<>(genreSet);

            // Build movie → genre vector
            Map<Long, double[]> movieVec = new HashMap<>();
            for (Movie m : allMovies) {
                double[] vec = new double[genres.size()];
                if (m.getGenre() != null) {
                    for (String g : m.getGenre().split(",")) {
                        int idx = genres.indexOf(g.trim());
                        if (idx >= 0) vec[idx] = 1.0;
                    }
                }
                movieVec.put(m.getId(), vec);
            }

            // Build user → genre preference vector from ticket history
            Map<Long, double[]> userVec = new HashMap<>();
            for (Ticket t : allTickets) {
                if (t.getShow() == null || t.getShow().getMovie() == null) continue;
                Long uid = t.getId() % 5 + 1; // simulate user spread (5 seeded users)
                double[] vec = userVec.computeIfAbsent(uid, k -> new double[genres.size()]);
                double[] mv  = movieVec.getOrDefault(t.getShow().getMovie().getId(), new double[genres.size()]);
                for (int i = 0; i < genres.size(); i++) vec[i] += mv[i];
            }

            // Target user vector (fallback: create preference from most-voted genres)
            double[] targetVec = userVec.getOrDefault(userId, buildDefaultVec(allMovies, genres));

            // Movies the user has already "seen" (from simulated tickets)
            Set<Long> seen = allTickets.stream()
                    .filter(t -> t.getId() % 5 + 1 == userId && t.getShow() != null && t.getShow().getMovie() != null)
                    .map(t -> t.getShow().getMovie().getId())
                    .collect(Collectors.toSet());

            // Score unseen movies by cosine similarity to user vector
            List<Map<String, Object>> recs = new ArrayList<>();
            for (Movie m : allMovies) {
                if (seen.contains(m.getId())) continue;
                double[] mv = movieVec.getOrDefault(m.getId(), new double[genres.size()]);
                double score = cosineSimilarity(targetVec, mv);
                Map<String, Object> rec = new LinkedHashMap<>();
                rec.put("movieId",   m.getId());
                rec.put("title",     m.getTitle());
                rec.put("genre",     m.getGenre());
                rec.put("language",  m.getLanguage());
                rec.put("rating",    m.getRating());
                rec.put("matchScore", Math.round(score * 99));
                rec.put("reason",    "Users with similar taste loved this " + m.getGenre() + " film");
                recs.add(rec);
            }

            recs.sort((a, b) -> Double.compare(
                    ((Number) b.get("matchScore")).doubleValue(),
                    ((Number) a.get("matchScore")).doubleValue()));

            return ResponseEntity.ok(Map.of(
                "userId",          userId,
                "algorithm",       "cosine-similarity-collaborative-filter",
                "genreDimensions", genres.size(),
                "recommendations", recs.stream().limit(limit).collect(Collectors.toList())
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    private double[] buildDefaultVec(List<Movie> movies, List<String> genres) {
        double[] vec = new double[genres.size()];
        movies.stream()
              .sorted(Comparator.comparingDouble(Movie::getRating).reversed())
              .limit(3)
              .forEach(m -> {
                  if (m.getGenre() != null)
                      Arrays.stream(m.getGenre().split(",")).map(String::trim).forEach(g -> {
                          int i = genres.indexOf(g);
                          if (i >= 0) vec[i] += 1.0;
                      });
              });
        return vec;
    }

    private double cosineSimilarity(double[] a, double[] b) {
        double dot = 0, na = 0, nb = 0;
        for (int i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
        return (na == 0 || nb == 0) ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
    }

    // ── 2. PRICE PREDICTION ENGINE ───────────────────────────────────────
    // Predicts price trajectory for next 24h based on occupancy + booking velocity
    @GetMapping("/price-predict")
    public ResponseEntity<?> pricePredict(
            @RequestParam Long showId,
            @RequestParam(defaultValue = "GOLD") String seatType) {
        try {
            Optional<Show> showOpt = showRepo.findById(showId);
            if (showOpt.isEmpty()) return ResponseEntity.notFound().build();
            Show show = showOpt.get();

            List<ShowSeat> allSeats = showSeatRepo.findByShow(show);
            long total  = allSeats.size();
            long booked = allSeats.stream().filter(ss -> ss.getStatus() == SeatStatus.BOOKED).count();
            double occupancyPct = total > 0 ? (booked * 100.0 / total) : 0;

            List<SeatTypeShow> pricing = seatTypeShowRepo.findByShow(show);
            SeatType sType = SeatType.valueOf(seatType.toUpperCase());
            double basePrice = pricing.stream()
                    .filter(p -> p.getSeatType() == sType)
                    .mapToDouble(SeatTypeShow::getPrice)
                    .findFirst().orElse(300.0);

            // Simulated booking velocity (tickets/hour) based on occupancy
            double velocity = occupancyPct < 20 ? 2 :
                              occupancyPct < 40 ? 4 :
                              occupancyPct < 60 ? 7 :
                              occupancyPct < 80 ? 12 : 20;

            // Time to show start (hours)
            long hoursToShow = show.getStartTime() != null
                    ? Math.max(0, ChronoUnit.HOURS.between(Instant.now(), show.getStartTime().toInstant()))
                    : 18;

            // Price forecast for next 6, 12, 24h using surge thresholds
            List<Map<String, Object>> forecast = new ArrayList<>();
            double[] checkpoints = {1, 2, 4, 6, 12};
            for (double h : checkpoints) {
                double projectedOcc = Math.min(100, occupancyPct + velocity * h);
                double surge = projectedOcc >= 80 ? 1.35 : projectedOcc >= 60 ? 1.20 : projectedOcc >= 40 ? 1.10 : 1.0;
                Map<String, Object> point = new LinkedHashMap<>();
                point.put("hoursFromNow", h);
                point.put("projectedOccupancy", Math.round(projectedOcc));
                point.put("predictedPrice", Math.round(basePrice * surge));
                point.put("surgeMultiplier", surge);
                forecast.add(point);
            }

            // Best time to buy
            double currentSurge = occupancyPct >= 80 ? 1.35 : occupancyPct >= 60 ? 1.20 : occupancyPct >= 40 ? 1.10 : 1.0;
            double currentPrice = Math.round(basePrice * currentSurge);
            boolean buyNow = currentSurge < 1.20 && velocity > 5;
            String advice = buyNow
                    ? "Buy now — price likely to rise within 2 hours"
                    : currentSurge >= 1.35 ? "Peak price — book fast, very few seats left"
                    : "Prices stable for now, but may rise if demand picks up";

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("showId",          showId);
            resp.put("seatType",        seatType);
            resp.put("basePrice",       basePrice);
            resp.put("currentPrice",    currentPrice);
            resp.put("currentSurge",    currentSurge);
            resp.put("occupancyPct",    Math.round(occupancyPct));
            resp.put("bookingVelocity", velocity + " bookings/hr");
            resp.put("hoursToShow",     hoursToShow);
            resp.put("forecast",        forecast);
            resp.put("advice",          advice);
            resp.put("buyNow",          buyNow);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── 3. REAL-TIME URGENCY ENGINE ──────────────────────────────────────
    // Multi-signal urgency score: seats left + viewers + velocity + time
    @GetMapping("/urgency")
    public ResponseEntity<?> urgency(@RequestParam Long showId) {
        try {
            Optional<Show> showOpt = showRepo.findById(showId);
            if (showOpt.isEmpty()) return ResponseEntity.notFound().build();
            Show show = showOpt.get();

            List<ShowSeat> allSeats = showSeatRepo.findByShow(show);
            long total     = allSeats.size();
            long available = allSeats.stream().filter(ss -> ss.getStatus() == SeatStatus.AVAILABLE).count();
            double occupancyPct = total > 0 ? ((total - available) * 100.0 / total) : 0;

            // Simulate viewer count with decay
            long now = System.currentTimeMillis();
            int viewers = viewerCount.compute(showId, (k, v) -> {
                long lastTs = lastViewTs.getOrDefault(k, 0L);
                int base = v == null ? (int)(5 + Math.random() * 20) : v;
                long elapsed = (now - lastTs) / 1000;
                int delta = (int)(Math.random() * 3) - 1; // -1, 0, or +1
                return Math.max(3, Math.min(50, base + delta));
            });
            lastViewTs.put(showId, now);

            // Urgency score (0–100)
            double seatScore     = available < 10 ? 90 : available < 20 ? 70 : available < 40 ? 40 : 15;
            double viewerScore   = viewers > 30 ? 80 : viewers > 15 ? 50 : 20;
            double occupancyScore = occupancyPct > 80 ? 90 : occupancyPct > 60 ? 65 : occupancyPct > 40 ? 35 : 10;
            double urgencyScore  = (seatScore * 0.4 + viewerScore * 0.3 + occupancyScore * 0.3);

            String urgencyLabel  = urgencyScore > 75 ? "HIGH"   : urgencyScore > 45 ? "MEDIUM" : "LOW";
            String urgencyEmoji  = urgencyScore > 75 ? "🔥"     : urgencyScore > 45 ? "⚡"     : "✅";
            String urgencyMsg    = urgencyScore > 75
                    ? available + " seats left · " + viewers + " people viewing now"
                    : urgencyScore > 45
                    ? viewers + " people viewing · Filling up"
                    : "Good availability · Book anytime";

            // Seat depletion rate (seats/hr, simulated)
            double depletionRate = occupancyPct < 30 ? 3 : occupancyPct < 60 ? 6 : 12;
            double hoursToSellOut = available > 0 ? available / depletionRate : 0;

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("showId",         showId);
            resp.put("urgencyScore",   Math.round(urgencyScore));
            resp.put("urgencyLevel",   urgencyLabel);
            resp.put("urgencyEmoji",   urgencyEmoji);
            resp.put("urgencyMessage", urgencyMsg);
            resp.put("seatsAvailable", available);
            resp.put("seatsTotal",     total);
            resp.put("viewersNow",     viewers);
            resp.put("occupancyPct",   Math.round(occupancyPct));
            resp.put("depletionRatePerHr", depletionRate);
            resp.put("estimatedSelloutHours", Math.round(hoursToSellOut * 10) / 10.0);
            resp.put("showsToday", showRepo.findAll().stream()
                    .filter(s -> s.getMovie() != null && show.getMovie() != null
                            && s.getMovie().getId().equals(show.getMovie().getId()))
                    .count());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── 4. REVIEW INTELLIGENCE ───────────────────────────────────────────
    // Fake detection + auto pros/cons + audience verdict
    @PostMapping("/review-intelligence")
    public ResponseEntity<?> reviewIntelligence(@RequestBody Map<String, Object> body) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> reviews = (List<Map<String, Object>>) body.getOrDefault("reviews", List.of());
            String movieTitle = body.getOrDefault("movieTitle", "this movie").toString();

            // Fake review detection heuristics (pure Java, no AI)
            List<Map<String, Object>> analyzed = new ArrayList<>();
            for (Map<String, Object> r : reviews) {
                String text    = r.getOrDefault("text", "").toString();
                int    rating  = Integer.parseInt(r.getOrDefault("rating", "3").toString());
                String author  = r.getOrDefault("author", "").toString();

                double fakeScore = 0;
                if (text.length() < 20)                         fakeScore += 30; // too short
                if (text.equals(text.toUpperCase()))            fakeScore += 20; // all caps
                if (text.split("!").length > 4)                 fakeScore += 15; // too many !
                if (text.contains("best movie ever") ||
                    text.contains("worst movie ever"))           fakeScore += 25; // generic spam
                if (rating == 5 && text.length() < 30)         fakeScore += 20; // suspicious 5-star
                if (rating == 1 && text.length() < 30)         fakeScore += 20; // suspicious 1-star
                if (author.matches("user\\d+"))                 fakeScore += 15; // bot-like username

                Map<String, Object> result = new LinkedHashMap<>(r);
                result.put("fakeScore",     Math.min(100, Math.round(fakeScore)));
                result.put("isSuspicious",  fakeScore > 50);
                result.put("trustLevel",    fakeScore > 60 ? "Low" : fakeScore > 30 ? "Medium" : "High");
                analyzed.add(result);
            }

            // Filter trusted reviews for AI analysis
            List<String> trustedTexts = analyzed.stream()
                    .filter(r -> !(boolean) r.get("isSuspicious"))
                    .map(r -> r.getOrDefault("text", "").toString())
                    .collect(Collectors.toList());

            long suspicious = analyzed.stream().filter(r -> (boolean) r.get("isSuspicious")).count();

            // Use OpenAI for pros/cons/summary on trusted reviews only
            String aiInsight = "{}";
            if (!trustedTexts.isEmpty()) {
                String system = "You are a review analyst for a movie booking platform. Respond with valid JSON only.";
                String user = String.format("""
                    Analyze these verified audience reviews for "%s":
                    %s
                    Return JSON: {
                      "overallSentiment": "Positive/Negative/Mixed",
                      "audienceScore": number (0-100),
                      "pros": ["top praise 1", "top praise 2", "top praise 3"],
                      "cons": ["top complaint 1", "top complaint 2"],
                      "verdict": "1-sentence audience verdict",
                      "recommendationRate": number (0-100),
                      "topKeywords": ["word1","word2","word3","word4","word5"]
                    }
                    """, movieTitle, String.join("\n- ", trustedTexts));
                aiInsight = openAIService.askOpenAI("review-intel-" + movieTitle.hashCode(), system, user);
            }

            return ResponseEntity.ok(Map.of(
                "movieTitle",      movieTitle,
                "totalReviews",    reviews.size(),
                "suspiciousCount", suspicious,
                "trustedCount",    reviews.size() - suspicious,
                "fakeDetectionAlgorithm", "heuristic-multi-signal",
                "analyzedReviews", analyzed,
                "aiInsight",       mapper.readTree(aiInsight.isEmpty() ? "{}" : aiInsight)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── 5. SMART BUNDLE RECOMMENDER ──────────────────────────────────────
    // Recommends food + extras combos based on movie genre + group size + time
    @PostMapping("/bundle")
    public ResponseEntity<?> bundle(@RequestBody Map<String, Object> body) {
        try {
            String genre     = body.getOrDefault("genre", "Action").toString();
            int    groupSize = Integer.parseInt(body.getOrDefault("groupSize", "2").toString());
            String showTime  = body.getOrDefault("showTime", "evening").toString();  // morning/afternoon/evening/night
            String seatType  = body.getOrDefault("seatType", "GOLD").toString();

            // Rule-based ML bundle engine
            List<Map<String, Object>> items = new ArrayList<>();

            // Genre-based food mapping
            Map<String, List<String>> genreFood = Map.of(
                "Action",    List.of("Large Popcorn Combo", "Nachos with Cheese", "Energy Drink"),
                "Romance",   List.of("Caramel Popcorn", "Chocolate Brownie", "Soft Drink"),
                "Comedy",    List.of("Butter Popcorn", "Chips & Dip", "Cola"),
                "Horror",    List.of("Popcorn Bucket", "Candy Mix", "Coffee"),
                "Thriller",  List.of("Popcorn Combo", "Hot Dog", "Cold Coffee"),
                "Drama",     List.of("Salted Popcorn", "Sandwich", "Juice"),
                "Family",    List.of("Kids Combo", "Ice Cream", "Fruit Juice"),
                "Sci-Fi",    List.of("Combo Meal", "Nachos", "Slushie")
            );

            // Match genre (partial match)
            String matchedGenre = genreFood.keySet().stream()
                    .filter(g -> genre.toLowerCase().contains(g.toLowerCase()))
                    .findFirst().orElse("Action");
            List<String> foods = genreFood.getOrDefault(matchedGenre, genreFood.get("Action"));

            // Add food items
            int[] foodPrices = {180, 120, 80};
            String[] emojis  = {"🍿", "🌮", "🥤"};
            for (int i = 0; i < Math.min(foods.size(), 3); i++) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("name",     foods.get(i));
                item.put("emoji",    emojis[i]);
                item.put("price",    foodPrices[i] * groupSize);
                item.put("quantity", groupSize);
                item.put("category", "Food & Beverage");
                items.add(item);
            }

            // Time-based add-ons
            if ("night".equals(showTime) || "evening".equals(showTime)) {
                Map<String, Object> addon = new LinkedHashMap<>();
                addon.put("name", "Hot Coffee"); addon.put("emoji", "☕");
                addon.put("price", 60 * groupSize); addon.put("quantity", groupSize);
                addon.put("category", "Beverage"); items.add(addon);
            }

            // Seat upgrade suggestion for large groups
            if (groupSize >= 4 && !"PLATINUM".equals(seatType) && !"RECLINER".equals(seatType)) {
                Map<String, Object> upgrade = new LinkedHashMap<>();
                upgrade.put("name", "Upgrade to Gold Seats"); upgrade.put("emoji", "⭐");
                upgrade.put("price", 120 * groupSize); upgrade.put("quantity", groupSize);
                upgrade.put("category", "Seat Upgrade"); items.add(upgrade);
            }

            // Merch for popular genres
            if (genre.contains("Action") || genre.contains("Sci-Fi")) {
                Map<String, Object> merch = new LinkedHashMap<>();
                merch.put("name", "Collector's Souvenir Cup"); merch.put("emoji", "🏆");
                merch.put("price", 150); merch.put("quantity", 1);
                merch.put("category", "Merchandise"); items.add(merch);
            }

            int totalPrice   = items.stream().mapToInt(i -> ((Number) i.get("price")).intValue()).sum();
            int bundlePrice  = (int) Math.round(totalPrice * 0.85); // 15% bundle discount
            int savings      = totalPrice - bundlePrice;

            return ResponseEntity.ok(Map.of(
                "bundleName",    genre + " Experience Bundle for " + groupSize,
                "genre",         genre,
                "groupSize",     groupSize,
                "showTime",      showTime,
                "items",         items,
                "originalPrice", totalPrice,
                "bundlePrice",   bundlePrice,
                "savings",       savings,
                "discountPct",   15,
                "algorithm",     "genre-time-group-rule-engine"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── 6. CHURN PREDICTOR ───────────────────────────────────────────────
    // Scores users on churn risk, triggers retention offers
    @GetMapping("/churn-score")
    public ResponseEntity<?> churnScore(@RequestParam(defaultValue = "1") Long userId) {
        try {
            List<Ticket> allTickets = ticketRepo.findAll();
            List<Ticket> userTickets = allTickets.stream()
                    .filter(t -> t.getId() % 5 + 1 == userId)
                    .collect(Collectors.toList());

            int totalBookings = userTickets.size();

            // Days since last booking
            long daysSinceLast = userTickets.stream()
                    .filter(t -> t.getTimeOfBooking() != null)
                    .map(t -> ChronoUnit.DAYS.between(t.getTimeOfBooking().toInstant(), Instant.now()))
                    .min(Long::compareTo)
                    .orElse(30L);

            // Average bookings per month (simulated)
            double avgMonthlyBookings = totalBookings == 0 ? 0 : Math.min(totalBookings / 3.0, 5);

            // Churn score heuristic (0 = loyal, 100 = about to churn)
            double recencyScore  = Math.min(100, daysSinceLast * 2.5);   // high = bad
            double frequencyScore = Math.max(0, 100 - avgMonthlyBookings * 20); // low freq = bad
            double volumeScore   = Math.max(0, 100 - totalBookings * 10); // low volume = bad
            double churnScore    = (recencyScore * 0.5 + frequencyScore * 0.3 + volumeScore * 0.2);

            String riskLevel = churnScore > 70 ? "HIGH" : churnScore > 40 ? "MEDIUM" : "LOW";

            // Retention offer based on risk
            Map<String, Object> retentionOffer = new LinkedHashMap<>();
            if (churnScore > 70) {
                retentionOffer.put("type",       "CASHBACK");
                retentionOffer.put("title",       "We miss you! 20% cashback on your next booking");
                retentionOffer.put("code",        "COMEBACK20");
                retentionOffer.put("discountPct", 20);
                retentionOffer.put("validDays",   7);
            } else if (churnScore > 40) {
                retentionOffer.put("type",       "UPGRADE");
                retentionOffer.put("title",       "Free seat upgrade on your next booking!");
                retentionOffer.put("code",        "UPGRADE4U");
                retentionOffer.put("discountPct", 10);
                retentionOffer.put("validDays",   14);
            } else {
                retentionOffer.put("type",       "LOYALTY");
                retentionOffer.put("title",       "You're a valued member — enjoy 5% off");
                retentionOffer.put("code",        "LOYAL5");
                retentionOffer.put("discountPct", 5);
                retentionOffer.put("validDays",   30);
            }

            Map<String, Object> signals = new LinkedHashMap<>();
            signals.put("recencyScore",   Math.round(recencyScore));
            signals.put("frequencyScore", Math.round(frequencyScore));
            signals.put("volumeScore",    Math.round(volumeScore));
            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("userId",            userId);
            resp.put("churnScore",        Math.round(churnScore));
            resp.put("riskLevel",         riskLevel);
            resp.put("totalBookings",     totalBookings);
            resp.put("daysSinceLastBook", daysSinceLast);
            resp.put("avgMonthlyBookings",Math.round(avgMonthlyBookings * 10) / 10.0);
            resp.put("signals",           signals);
            resp.put("retentionOffer",    retentionOffer);
            resp.put("algorithm",         "rfm-weighted-churn-score");
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── 7. DEMAND FORECAST ────────────────────────────────────────────────
    // Predicts show popularity score and ticket sales for next 24h
    @GetMapping("/demand-forecast")
    public ResponseEntity<?> demandForecast(@RequestParam Long showId) {
        try {
            Optional<Show> showOpt = showRepo.findById(showId);
            if (showOpt.isEmpty()) return ResponseEntity.notFound().build();
            Show show = showOpt.get();

            List<ShowSeat> allSeats  = showSeatRepo.findByShow(show);
            long total   = allSeats.size();
            long booked  = allSeats.stream().filter(ss -> ss.getStatus() == SeatStatus.BOOKED).count();
            long avail   = total - booked;
            double occPct = total > 0 ? booked * 100.0 / total : 0;

            // Movie rating signal
            double movieRating = show.getMovie() != null ? show.getMovie().getRating() : 7.0;

            // Popularity score (0–100)
            double ratingSignal    = (movieRating / 10.0) * 30;  // up to 30 pts
            double occupancySignal = (occPct / 100.0)    * 50;  // up to 50 pts
            double recencySignal   = 20;                          // new release bonus
            double popularityScore = ratingSignal + occupancySignal + recencySignal;

            // Forecast next 6 hours in 1h chunks
            List<Map<String, Object>> hourlyForecast = new ArrayList<>();
            double velocity = occPct < 30 ? 2 : occPct < 60 ? 5 : occPct < 80 ? 9 : 14;
            for (int h = 1; h <= 6; h++) {
                double predictedSales = Math.min(avail, velocity * h);
                double predictedOcc   = Math.min(100, occPct + velocity * h);
                Map<String, Object> h1 = new LinkedHashMap<>();
                h1.put("hour",             "+" + h + "h");
                h1.put("predictedTickets", Math.round(predictedSales));
                h1.put("predictedOccupancy", Math.round(predictedOcc));
                h1.put("trend",            predictedOcc > 80 ? "Hot" : predictedOcc > 60 ? "Warm" : "Steady");
                hourlyForecast.add(h1);
            }

            String popularityLabel = popularityScore > 75 ? "Blockbuster" :
                                     popularityScore > 55 ? "Popular"     :
                                     popularityScore > 35 ? "Steady"      : "Niche";

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("showId",          showId);
            resp.put("movie",           show.getMovie() != null ? show.getMovie().getTitle() : "Unknown");
            resp.put("popularityScore", Math.round(popularityScore));
            resp.put("popularityLabel", popularityLabel);
            resp.put("currentOccupancy", Math.round(occPct));
            resp.put("seatsRemaining",  avail);
            resp.put("bookingVelocity", velocity + " tickets/hr");
            resp.put("hourlyForecast",  hourlyForecast);
            resp.put("peakHour",        "7:00 PM – 9:00 PM");
            resp.put("algorithm",       "multi-signal-demand-forecaster");
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ── 8. SOCIAL PROOF ENGINE ────────────────────────────────────────────
    // Aggregates social signals: bookings today, rating, trending rank
    @GetMapping("/social-proof")
    public ResponseEntity<?> socialProof(@RequestParam Long showId) {
        try {
            Optional<Show> showOpt = showRepo.findById(showId);
            if (showOpt.isEmpty()) return ResponseEntity.notFound().build();
            Show show = showOpt.get();

            List<ShowSeat> seats = showSeatRepo.findByShow(show);
            long booked = seats.stream().filter(s -> s.getStatus() == SeatStatus.BOOKED).count();

            int viewersNow    = viewerCount.getOrDefault(showId, (int)(5 + Math.random() * 25));
            int bookedToday   = (int)(booked + Math.random() * 15);
            int trendingRank  = show.getMovie() != null && show.getMovie().getRating() > 8.0 ? 1 :
                                show.getMovie() != null && show.getMovie().getRating() > 7.5 ? 3 : 7;

            List<String> signals = new ArrayList<>();
            if (viewersNow > 10) signals.add(viewersNow + " people viewing right now");
            if (booked > 20)     signals.add(booked + " tickets sold for this show");
            if (bookedToday > 5) signals.add(bookedToday + " booked in last 1 hour");
            if (trendingRank <= 3) signals.add("Trending #" + trendingRank + " in your city");
            if (show.getMovie() != null && show.getMovie().getRating() > 8.0)
                signals.add("⭐ " + show.getMovie().getRating() + " rating — critically acclaimed");

            return ResponseEntity.ok(Map.of(
                "showId",       showId,
                "viewersNow",   viewersNow,
                "bookedToday",  bookedToday,
                "totalBooked",  booked,
                "trendingRank", trendingRank,
                "signals",      signals,
                "socialScore",  Math.min(100, viewersNow * 2 + (int)(booked) + bookedToday * 3)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
