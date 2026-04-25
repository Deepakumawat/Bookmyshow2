package Bookmyshow2.controllers;

import Bookmyshow2.mongo.MongoUserRepository;
import Bookmyshow2.mongo.UserDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/mongo/users")
public class MongoUserController {

    @Autowired private MongoUserRepository repo;

    // ── Register ──────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String email = body.getOrDefault("email", "").toString().trim().toLowerCase();
        String name  = body.getOrDefault("name",  "").toString().trim();
        String city  = body.getOrDefault("city",  "Mumbai").toString().trim();

        if (email.isEmpty() || name.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "name and email required"));

        if (repo.existsByEmail(email))
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));

        UserDocument user = new UserDocument(name, email, city);
        user = repo.save(user);
        return ResponseEntity.ok(successResponse(user, "Registered successfully"));
    }

    // ── Login ─────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        String email = body.getOrDefault("email", "").toString().trim().toLowerCase();
        Optional<UserDocument> opt = repo.findByEmail(email);
        if (opt.isEmpty())
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));

        UserDocument user = opt.get();
        user.recordLogin();
        repo.save(user);
        return ResponseEntity.ok(successResponse(user, "Login successful"));
    }

    // ── Get Profile ───────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable String id) {
        return repo.findById(id)
                .map(u -> ResponseEntity.ok(successResponse(u, "ok")))
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Update Profile ────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return repo.findById(id).map(u -> {
            if (body.containsKey("name")) u.setName(body.get("name").toString());
            if (body.containsKey("city")) u.setCity(body.get("city").toString());
            if (body.containsKey("phone")) u.setPhone(body.get("phone").toString());
            repo.save(u);
            return ResponseEntity.ok(successResponse(u, "Updated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> successResponse(UserDocument u, String msg) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("message",        msg);
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
    }
}
