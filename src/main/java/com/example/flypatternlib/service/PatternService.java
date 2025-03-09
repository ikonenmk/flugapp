package com.example.flypatternlib.service;
import com.example.flypatternlib.DTO.FlyTypeDTO;
import com.example.flypatternlib.model.*;
import com.example.flypatternlib.repository.*;
import com.example.flypatternlib.utils.regexValidation;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private final CommentRepository commentRepository;
    private final NotificationsRepository notificationsRepository;

    public PatternService(PatternRepository repository, SpeciesRepository speciesRepository, MaterialRepository materialRepository, UserService userService, PatternMaterialRepository patternMaterialRepository, PatternSpeciesRepository patternSpeciesRepository, PatternManagementService patternManagementService, CommentRepository commentRepository, NotificationsRepository notificationsRepository) {
        this.patternRepository = repository;
        this.speciesRepository = speciesRepository;
        this.materialRepository = materialRepository;
        this.userService = userService;
        this.patternMaterialRepository = patternMaterialRepository;
        this.patternSpeciesRepository = patternSpeciesRepository;
        this.patternManagementService = patternManagementService;
        this.commentRepository = commentRepository;
        this.notificationsRepository = notificationsRepository;
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

    public void addComment(String username, int patternId, String commentText) {
        // Check length of comment-text
        if(commentText.isEmpty() || commentText.length() > 2000) {
            System.out.println("length of comment text not allowed");
            throw new IllegalArgumentException("length of comment text not allowed");
        }
        // Check allowed characters
        String regex = "^[a-zA-Z0-9 \\n\\r .,?!'\"()/-]*$";
        if (!regexValidation.validateRegex(regex, commentText)) {
            System.out.println("comment contains illegal characters");
            throw new IllegalArgumentException("comment contains illegal characters");
        }
        // Create Comment object and add to database
        System.out.println("Saving comment with text: " + commentText);
        Comment newComment = new Comment();
        newComment.setUsername(username);
        newComment.setPatternId(patternId);
        newComment.setCommentText(commentText);
        newComment.setTimeOfPosting(LocalDateTime.now());
        commentRepository.save(newComment);

        // Create Notification object and create notification for creator of pattern
        String creator = patternRepository.getCreatorByPatternId(patternId);
        if (creator != null) {
            Notification newNotification = new Notification();
            newNotification.setUsername(creator);
            newNotification.setPatternId(patternId);
            newNotification.setPatternName(patternRepository.getPatternNameById(patternId));
            notificationsRepository.save(newNotification);
        } else {
            throw new RuntimeException("No creator found for that pattern id");
        }


    }

    public List<Comment> getCommentsForPattern(int patternId) {
        return commentRepository.getCommentsForPattern(patternId);
    }

    public void deleteCommentById(int commentId) {
        // Check if id exists in database
        if(commentRepository.findById(commentId).isEmpty()) {
            throw new RuntimeException("Id was not found in database");
        } else {
            System.out.println("trying to delete comment with id = " +commentId);
            commentRepository.deleteById(commentId);
        }
    }
}
