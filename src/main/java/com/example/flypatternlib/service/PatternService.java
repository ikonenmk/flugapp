package com.example.flypatternlib.service;
import com.example.flypatternlib.DTO.FlyTypeDTO;
import com.example.flypatternlib.model.*;
import com.example.flypatternlib.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PatternService {

    private final PatternRepository patternRepository;
    private final SpeciesRepository speciesRepository;
    private final MaterialRepository materialRepository;
    private final UserService userService;
    private final PatternMaterialRepository patternMaterialRepository;
    private final PatternSpeciesRepository patternSpeciesRepository;
    private final PatternManagementService patternManagementService;

    public PatternService(PatternRepository repository, SpeciesRepository speciesRepository, MaterialRepository materialRepository, UserService userService, PatternMaterialRepository patternMaterialRepository, PatternSpeciesRepository patternSpeciesRepository, PatternManagementService patternManagementService) {
        this.patternRepository = repository;
        this.speciesRepository = speciesRepository;
        this.materialRepository = materialRepository;
        this.userService = userService;
        this.patternMaterialRepository = patternMaterialRepository;
        this.patternSpeciesRepository = patternSpeciesRepository;
        this.patternManagementService = patternManagementService;
    }

    //Find a pattern by fly type
    public List<Pattern> findByType(String type) {
        return patternRepository.findByType(type);
    }

    //Return a list of all "type" saved patterns have
    public List<FlyTypeDTO> findAllTypes() {

        List<FlyTypeDTO> listOfTypes = new ArrayList<FlyTypeDTO>();

        //Find all types in
        List<String> listOfTypeStrings = patternRepository.findAllTypes();
        //Clean list of duplicates
        List<String> allTypeStringsNoDuplicates = listOfTypeStrings.stream().distinct().toList();

        //Loop through List of fly type strings and create object for each string
        for (int i = 0; i < allTypeStringsNoDuplicates.size(); i++) {
            FlyTypeDTO flyTypeDTO = new FlyTypeDTO(i, allTypeStringsNoDuplicates.get(i));
            listOfTypes.add(flyTypeDTO);
        }
        //return list of FlyTypeDTOs
        return listOfTypes;
    }

    //Method for adding pattern to DB
    public void addPattern(Pattern pattern, String[] speciesArray, String[] materialsArray) {

        List<Material> materialsToAdd = new ArrayList<Material>();
        List<Species> speciesToAdd = new ArrayList<Species>();

        //Loop through species and materials arrays and save returned object to lists
        if (materialsArray != null) {
            for (int i = 0; i < materialsArray.length; i++) {
                Material material = (Material) addObject("material", materialsArray[i].toLowerCase());
                materialsToAdd.add(material);
            }
        }

        if (speciesArray != null) {
            for (int i = 0; i < speciesArray.length; i++) {
                Species species = (Species) addObject("species", speciesArray[i].toLowerCase());
                speciesToAdd.add(species);
            }
        }

        //Add rows to junction tables
        for (int i = 0; i < materialsToAdd.size(); i++) {
            pattern.addMaterial(materialsToAdd.get(i)); //add new PatternMaterial row
        }
        for (int i = 0; i < speciesToAdd.size(); i++) {
            pattern.addSpecies(speciesToAdd.get(i)); //add new PatternSpecis row
        }
        //Save pattern to DB
        patternRepository.save(pattern);

    }

    //Method returning a PatternObject based on stated type of object
    public PatternObject addObject(String typeOfObject, String objectName) {
        //Loop through array of added materials
        if (Objects.equals(typeOfObject, "material")) {
            //Return existing Material if already in DB, or create a new Material
            if (materialRepository.findByName(objectName) != null) {
                Material existingMaterial = materialRepository.findByName(objectName);
                return existingMaterial;
            } else {
                Material newMaterial = new Material();
                newMaterial.setName(objectName);
                materialRepository.save(newMaterial);
                return newMaterial;
            }
        } else if (Objects.equals(typeOfObject, "species")) {
            //Return existing Species if already in DB, or create a new Species
            if (speciesRepository.findByName(objectName) != null) {
                Species existingSpecies = speciesRepository.findByName(objectName);
                return existingSpecies;
            } else {
                Species newSpecies = new Species();
                newSpecies.setName(objectName);
                speciesRepository.save(newSpecies);
                return newSpecies;
            }
        } else {
            return null;
        }

        //Check if material already exist in database
        //if in db addPatternMaterial with existing material
        //if not in db, add material to db, then add material to patternMaterial


    }

    public List<Pattern> findByName(String name) {
        return patternRepository.findByName(name);
    }

    public List<String> findAllCreators() {
        return patternRepository.findAllCreators();
    }

    public void deleteById(Integer patternId) {
        patternManagementService.deleteById(patternId);
    }
}
