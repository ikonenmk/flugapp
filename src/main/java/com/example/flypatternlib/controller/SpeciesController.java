package com.example.flypatternlib.controller;
import com.example.flypatternlib.model.Species;
import com.example.flypatternlib.repository.SpeciesRepository;
import com.example.flypatternlib.service.SpeciesService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/species")
public class SpeciesController {

    private final SpeciesRepository repository;
    private final SpeciesService service;

    public SpeciesController(SpeciesRepository repository, SpeciesService service) {
        this.repository = repository;
        this.service = service;
    }


    // Find all species
    @GetMapping
    public List<Species> findAll() {
        return repository.findAll();
    }

    // Add a new species
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public void add(@RequestBody Species species) {
        System.out.println("Received request to add species: " + species.getName());

        repository.save(species);
    }

    // Delete species
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{species_id}")
    public void delete(@PathVariable Integer species_id) {
        //throw error if species id not found
        if(!repository.existsById(species_id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Species not found");
        }
        repository.deleteById(species_id);
    }

    // Return species names based on array of id:s
    @GetMapping("/names/{speciesIds}")
    public List<Optional<Species>> findById(@PathVariable int[] speciesIds) {
        return service.findById(speciesIds);
    }

}
