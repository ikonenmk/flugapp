package com.example.flypatternlib.controller;
import com.example.flypatternlib.model.PatternSpecies;
import com.example.flypatternlib.repository.PatternSpeciesRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/patternspecies")
public class PatternSpeciesController {
    private final PatternSpeciesRepository repository;

    public PatternSpeciesController(PatternSpeciesRepository repository) {
        this.repository = repository;
    }

    // Add new relation between pattern and species
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public void add(@RequestBody PatternSpecies patternSpecies) {
        repository.save(patternSpecies);
    }

    // Delete
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{pattern_species_id}")
    public void delete(@PathVariable Integer pattern_species_id) {
        //throw error if id not existing
        if(!repository.existsById(pattern_species_id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "patternspecies id not found");
        }
        repository.deleteById(pattern_species_id);
    }

    // Find by patternId
    @GetMapping("/{pattern_id}")
    public List<PatternSpecies> findByPatternId(@PathVariable Integer pattern_id) {
        return repository.findByPatternId(pattern_id);
    }
}
