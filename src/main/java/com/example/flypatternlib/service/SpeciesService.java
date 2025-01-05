package com.example.flypatternlib.service;

import com.example.flypatternlib.model.Species;
import com.example.flypatternlib.repository.SpeciesRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SpeciesService {
    final SpeciesRepository speciesRepository;

    public SpeciesService(SpeciesRepository speciesRepository) {
        this.speciesRepository = speciesRepository;
    }

    public List<Optional<Species>> findById(int[] speciesIds){
        List<Optional<Species>> foundSpecies = new ArrayList<>();
        for (int speciesId : speciesIds) {
            foundSpecies.add(speciesRepository.findById(speciesId));
        }
        return foundSpecies;
    }
    }

