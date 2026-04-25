package Bookmyshow2.controllers;

import Bookmyshow2.models.Show;
import Bookmyshow2.repositories.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final ShowRepository showRepository;

    @Autowired
    public ShowController(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    /**
     * GET /api/shows - Get all shows
     */
    @GetMapping
    public ResponseEntity<List<Show>> getAllShows() {
        List<Show> shows = showRepository.findAll();
        return ResponseEntity.ok(shows);
    }

    /**
     * GET /api/shows/{id} - Get show by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable Long id) {
        return showRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * POST /api/shows - Create a new show
     */
    @PostMapping
    public ResponseEntity<Show> createShow(@RequestBody Show show) {
        Show savedShow = showRepository.save(show);
        return ResponseEntity.ok(savedShow);
    }

    /**
     * PUT /api/shows/{id} - Update a show
     */
    @PutMapping("/{id}")
    public ResponseEntity<Show> updateShow(@PathVariable Long id, @RequestBody Show show) {
        return showRepository.findById(id)
                .map(existingShow -> {
                    existingShow.setStartTime(show.getStartTime());
                    existingShow.setEndTime(show.getEndTime());
                    existingShow.setFeatures(show.getFeatures());
                    existingShow.setScreen(show.getScreen());
                    return ResponseEntity.ok(showRepository.save(existingShow));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/shows/{id} - Delete a show
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        if (showRepository.existsById(id)) {
            showRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
