package com.example.flypatternlib.controller;

import com.example.flypatternlib.DTO.CreatorDTO;
import com.example.flypatternlib.DTO.FlyTypeDTO;
import com.example.flypatternlib.model.Comment;
import com.example.flypatternlib.model.Pattern;
import com.example.flypatternlib.repository.MaterialRepository;
import com.example.flypatternlib.repository.PatternRepository;
import com.example.flypatternlib.repository.SpeciesRepository;
import com.example.flypatternlib.response.ApiResponse;
import com.example.flypatternlib.service.PatternService;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PatternController {

    private final PatternRepository patternRepository;
    private final MaterialRepository materialRepository;
    private final SpeciesRepository speciesRepository;
    private final PatternService patternService;

    // file directory for images
    private final String UPLOAD_DIR = "/uploads/images/";

    public PatternController(PatternRepository patternRepository, MaterialRepository materialRepository, SpeciesRepository speciesRepository, PatternService patternService) {
        this.patternRepository = patternRepository;
        this.materialRepository = materialRepository;
        this.speciesRepository = speciesRepository;
        this.patternService = patternService;
    }

    // Find all patterns in database
    @GetMapping("/pattern/find")
    public List<Pattern> findAll() {
        return patternRepository.findAllByIdDesc();
    }

    // Add a new pattern
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/pattern")
    public void add(@RequestBody Pattern pattern, @RequestParam("speciesArray") String[] speciesArray, @RequestParam("materialsArray") String[] materialsArray) {
        //Add pattern to DB
        patternService.addPattern(pattern, speciesArray, materialsArray);
    }

    // Find a pattern based on id
    @GetMapping("/pattern/{pattern_id}")
    public Optional<Pattern> findPattern(@PathVariable Integer pattern_id) {
        return patternRepository.findById(pattern_id);
    }

    // Delete a pattern
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/pattern/{pattern_id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Integer pattern_id) {
        try {
            patternService.deleteById(pattern_id);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse("Pattern deleted from database", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Pattern could not be deleted: " + e.getMessage(), false));
        }
    }

    // Update a pattern
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/pattern/{pattern_id}")
    public void update(@PathVariable Integer pattern_id, @RequestBody Pattern pattern, @RequestParam("speciesArray") String[] speciesArray, @RequestParam("materialsArray") String[] materialsArray) {
        //If pattern id not in DB, throw error
        if (!patternRepository.existsById(pattern_id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pattern not found.");
        }
        //If pattern id in request body does not match path variable, throw error
        if (!Objects.equals(pattern.getId(), pattern_id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pattern not found.");
        }
        patternService.addPattern(pattern, speciesArray, materialsArray);
    }

    // Find all types
    @GetMapping("/pattern/types")
    public List<FlyTypeDTO> findAllTypes() {
        return patternService.findAllTypes();
    }

    // Endpoint for uploading image
    @PostMapping("/pattern/uploadimage")
    public ResponseEntity<String> imageUpload(@RequestParam MultipartFile file) {
        try {
            File directory = new File(UPLOAD_DIR);
            // Check if dir exists
            if (!directory.exists()) {
                boolean dirCreated = directory.mkdirs();
                if (!dirCreated) {
                    throw new IOException("Failed to create directory: " + UPLOAD_DIR);
                }
            }

            String filePath = UPLOAD_DIR + file.getOriginalFilename();

            file.transferTo(new File(filePath));

            return ResponseEntity.ok("File uploaded");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File upload failed");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error occurred");
        }
    }

    // Find by name
    @GetMapping("/name")
    public List<Pattern> findAllNames() {
        return patternRepository.findAll();
    }

    @GetMapping("/creator")
    public List<CreatorDTO> findAllCreators() {
        List<String> creators = patternService.findAllCreators();
        List<String> filteredList = creators.stream()
                .distinct()
                .collect(Collectors.toList());
        List<CreatorDTO> creatorsToReturn = new ArrayList<>();
        for (int i = 0; i < filteredList.size(); i++) {
            CreatorDTO newCreator = new CreatorDTO(i, filteredList.get(i));
            creatorsToReturn.add(newCreator);
        }
        return creatorsToReturn;
    }

    // Add comment
    @PostMapping("/pattern/comment")
    public ResponseEntity<ApiResponse> addComment(@RequestParam String username, @RequestParam int pattern_id, @RequestParam String comment_text) {
        try {
            patternService.addComment(username, pattern_id, comment_text);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse("Post added", true));

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Comment could not be added: " + e.getMessage(), false));
        }
    }

    // Get all comments for pattern id
    @GetMapping("/pattern/comment")
    public List<Comment> getCommentsForPattern(@RequestParam int pattern_id) {
        System.out.println("pattern id = " + pattern_id);
        return patternService.getCommentsForPattern(pattern_id);
    }

    // Delete comment by comment id
    @DeleteMapping("/pattern/comment")
    public ResponseEntity<ApiResponse> deleteComment(@RequestParam int comment_id) {
        try {
            patternService.deleteCommentById(comment_id);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse("Post deleted", true));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Comment could not be deleted " + e.getMessage(), false));
        }
    }

}
