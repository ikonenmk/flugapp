package com.example.flypatternlib.service;

import com.example.flypatternlib.model.Material;
import com.example.flypatternlib.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {
    final MaterialRepository materialRepository;

    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    // Find material based on array of ids
    public List<Optional<Material>> findById(int[] materialIds) {
        List<Optional<Material>> foundMaterials = new ArrayList<>();
        for (int materialId : materialIds) {
            foundMaterials.add(materialRepository.findById(materialId));
        }
        return foundMaterials;
    }
}
