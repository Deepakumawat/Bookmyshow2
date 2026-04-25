package Bookmyshow2.controllers;

import Bookmyshow2.models.Theatre;
import Bookmyshow2.repositories.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
public class TheatreController {

    private final TheatreRepository theatreRepository;

    @Autowired
    public TheatreController(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
    }

    /**
     * GET /api/theatres - Get all theatres
     */
    @GetMapping
    public ResponseEntity<List<Theatre>> getAllTheatres() {
        List<Theatre> theatres = theatreRepository.findAll();
        return ResponseEntity.ok(theatres);
    }

    /**
     * GET /api/theatres/{id} - Get theatre by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Theatre> getTheatreById(@PathVariable Long id) {
        return theatreRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * GET /api/theatres/city/{cityId} - Get theatres by city
     */
    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<Theatre>> getTheatresByCity(@PathVariable Long cityId) {
        List<Theatre> theatres = theatreRepository.findByCity_Id(cityId);
        return ResponseEntity.ok(theatres);
    }

    /**
     * POST /api/theatres - Create a new theatre
     */
    @PostMapping
    public ResponseEntity<Theatre> createTheatre(@RequestBody Theatre theatre) {
        Theatre savedTheatre = theatreRepository.save(theatre);
        return ResponseEntity.ok(savedTheatre);
    }

    /**
     * PUT /api/theatres/{id} - Update a theatre
     */
    @PutMapping("/{id}")
    public ResponseEntity<Theatre> updateTheatre(@PathVariable Long id, @RequestBody Theatre theatre) {
        return theatreRepository.findById(id)
                .map(existingTheatre -> {
                    existingTheatre.setName(theatre.getName());
                    existingTheatre.setAddress(theatre.getAddress());
                    existingTheatre.setCity(theatre.getCity());
                    return ResponseEntity.ok(theatreRepository.save(existingTheatre));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/theatres/{id} - Delete a theatre
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTheatre(@PathVariable Long id) {
        if (theatreRepository.existsById(id)) {
            theatreRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

}
