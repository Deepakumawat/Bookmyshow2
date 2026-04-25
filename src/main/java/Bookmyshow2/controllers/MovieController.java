package Bookmyshow2.controllers;

import Bookmyshow2.service.TMDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private TMDBService tmdb;

    @GetMapping("/now-playing")
    public ResponseEntity<?> nowPlaying() {
        if (!tmdb.isConfigured())
            return ResponseEntity.status(503).body(Map.of("error", "TMDB key not set"));
        List<Map<String, Object>> movies = tmdb.getNowPlaying();
        return ResponseEntity.ok(Map.of("movies", movies));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> upcoming() {
        if (!tmdb.isConfigured())
            return ResponseEntity.status(503).body(Map.of("error", "TMDB key not set"));
        List<Map<String, Object>> movies = tmdb.getUpcoming();
        return ResponseEntity.ok(Map.of("movies", movies));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> details(@PathVariable long id) {
        if (!tmdb.isConfigured())
            return ResponseEntity.status(503).body(Map.of("error", "TMDB key not set"));
        Map<String, Object> movie = tmdb.getMovieDetails(id);
        if (movie == null)
            return ResponseEntity.status(404).body(Map.of("error", "Movie not found"));
        return ResponseEntity.ok(movie);
    }
}
