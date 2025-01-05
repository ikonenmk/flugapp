package com.example.flypatternlib.controller;
import com.example.flypatternlib.model.Material;
import com.example.flypatternlib.repository.MaterialRepository;
import com.example.flypatternlib.service.MaterialService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/material")
public class MaterialController {

    private final MaterialRepository repository;
    private final MaterialService service;

    public MaterialController(MaterialRepository repository, MaterialService service) {
        this.repository = repository;
        this.service = service;
    }

    // Find all materials in db
    @GetMapping
    public List<Material> findAll() {
        return repository.findAll();
    }

    // Find material based on pattern id
    @GetMapping("/{pattern_id}")
    public List<Material> findByPatternId (@PathVariable Integer pattern_id){
        return repository.findByPatternId(pattern_id);
    }

    // Return materials based on array of id:s
    @GetMapping("/names/{materialIds}")
    public List<Optional<Material>> findById(@PathVariable int[] materialIds) {
        return service.findById(materialIds);
    }

    // Add a new material
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public void add(@RequestBody Material material) {
        repository.save(material);
    }

    // Delete material
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{material_id}")
    public void delete(@PathVariable Integer material_id) {
        //throw error if species id not found
        if(!repository.existsById(material_id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Species not found.");
        }
        repository.deleteById(material_id);
    }
}
