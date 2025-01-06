package com.example.flypatternlib.service;

import com.example.flypatternlib.model.PatternMaterial;
import com.example.flypatternlib.model.PatternSpecies;
import com.example.flypatternlib.repository.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PatternManagementService {
    private final PatternRepository patternRepository;
    private final PatternMaterialRepository patternMaterialRepository;
    private final PatternSpeciesRepository patternSpeciesRepository;
    private final MaterialRepository materialRepository;
    private final SpeciesRepository speciesRepository;
    public PatternManagementService(PatternRepository patternRepository, PatternMaterialRepository patternMaterialRepository, PatternSpeciesRepository patternSpeciesRepository, MaterialRepository materialRepository, SpeciesRepository speciesRepository) {
        this.patternRepository = patternRepository;
        this.patternMaterialRepository = patternMaterialRepository;
        this.patternSpeciesRepository = patternSpeciesRepository;
        this.materialRepository = materialRepository;
        this.speciesRepository = speciesRepository;
    }

    public void deleteById(Integer patternId) {
        // Add all material ids of pattern into a list
        List<Integer> materialIds = new ArrayList<Integer>();
        // Add all species ids of pattern into a list
        List<Integer> speciesIds = new ArrayList<Integer>();
        // Add all material of pattern to materialIds
        List<PatternMaterial> patternMaterials = patternMaterialRepository.findByPatternId(patternId);
        for (PatternMaterial material: patternMaterials) {
            materialIds.add(material.getMaterial());
        }
        // Add all species of pattern to speciesIds
        List<PatternSpecies> patternSpecies = patternSpeciesRepository.findByPatternId(patternId);
        for (PatternSpecies species: patternSpecies) {
            speciesIds.add(species.getSpecies());
        }
        // Delete pattern
        patternRepository.deleteById(patternId);
        // Delete material that is not used by any other pattern
        for (Integer materialId : materialIds) {
            List<PatternMaterial> foundMaterials = patternMaterialRepository.findByMaterialId(materialId);
            if (foundMaterials.isEmpty()) {
                // Delete material
                materialRepository.deleteById(materialId);
            }
        }
        // Delete species not used in any other pattern
        for (Integer speciesId : speciesIds) {
            List<PatternSpecies> foundSpecies = patternSpeciesRepository.findBySpeciesId(speciesId);
            if (foundSpecies.isEmpty()) {
                // Delete material
                speciesRepository.deleteById(speciesId);
            }
        }
    }
}
