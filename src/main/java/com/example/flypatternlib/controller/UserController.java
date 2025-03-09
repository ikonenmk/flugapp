package com.example.flypatternlib.controller;
import com.example.flypatternlib.DTO.ProfileDataDTO;
import com.example.flypatternlib.model.Notification;
import com.example.flypatternlib.model.UserRegRequest;
import com.example.flypatternlib.model.Pattern;
import com.example.flypatternlib.model.User;
import com.example.flypatternlib.repository.PatternRepository;
import com.example.flypatternlib.repository.UserOrderRepository;
import com.example.flypatternlib.repository.UserPatternRepository;
import com.example.flypatternlib.repository.UserRepository;
import com.example.flypatternlib.response.ApiResponse;
import com.example.flypatternlib.service.TokenService;
import com.example.flypatternlib.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository userRepository;
    private final UserPatternRepository userPatternRepository;
    private final PatternRepository patternRepository;
    private final UserOrderRepository orderRepository;
    private final UserService userService;
    private final TokenService tokenService;
    private final JdbcUserDetailsManager jdbcUserDetailsManager;

    public UserController(UserRepository repository, UserPatternRepository userPatternRepository, PatternRepository patternRepository, UserOrderRepository orderRepository, UserService userService, TokenService tokenService, JdbcUserDetailsManager jdbcUserDetailsManager) {
        this.userRepository = repository;
        this.userPatternRepository = userPatternRepository;
        this.patternRepository = patternRepository;
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.tokenService = tokenService;
        this.jdbcUserDetailsManager = jdbcUserDetailsManager;
    }

    // Register a new user
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public void register(@RequestBody UserRegRequest userRegRequest) {
        userService.addUser(userRegRequest);
    }

    // Update password of existing user
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/updatepassword")
    public void updatePassword(@RequestParam String username, @RequestParam String password) {
        // Update password
        userService.updatePassword(username, password);
        // Delete restore token for email
        String user = userService.findEmailByUsername(username);
        tokenService.delete(user);
    }

    // Find if e-mail already registered, returns true or false
    @GetMapping("/findemail")
    public Boolean findByEmail(@RequestParam String email) {
        return userService.findEmail(email);
    }
    // Find if user exist by username, returns true or false
    @GetMapping("/finduser")
    public Boolean findById(@RequestParam String username) {
        // Check if username exists, returns true or false
        return userService.findUser(username);
    }

    //Add pattern to User's library
    @PostMapping("/addpattern")
    public ResponseEntity<ApiResponse> addToLib(@RequestParam String username, @RequestParam Integer pattern_id) {
        //if username or patternId not found, throw error
        if (Objects.equals(userRepository.findByUserName(username), null) || !patternRepository.existsById(pattern_id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Username or pattern id not found", false));
        }
        // Find user
        User user = userRepository.returnUser(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        // Find pattern
        Pattern pattern = patternRepository.findById(pattern_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pattern not found"));

        // Check if pattern already added to users library
        if (userPatternRepository.patternExist(username, pattern_id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse("Pattern is already in library", false));
        } else {
            //Add reference between user and pattern
            user.addPattern(pattern);
            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse("Pattern added to library", true));
        }
    }

    // Get patterns saved in user's library
    @GetMapping("/getpatterns")
    public List<Optional<Pattern>> getUserPatterns(@RequestParam String username) {
        // Find user
        User user = userRepository.returnUser(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Find all pattern ids connected to user
        List<Integer> userPatternIds = userPatternRepository.findByUserName(username);

        // Add all patterns with users id to list of patterns to return to caller
        if (!userPatternIds.isEmpty()) {
            List<Optional<Pattern>> usersPatterns = new ArrayList<>();
            for (Integer userPatternId : userPatternIds) {
                Optional<Pattern> newPattern = patternRepository.findById(userPatternId);
                usersPatterns.add(newPattern);
            }
            return usersPatterns;
        } else {
            return null;
        }
    }

    // Get patterns created by user
    @GetMapping("/getcreatedpatterns")
    public List<Pattern> getCreatedPatterns(@RequestParam String username) {
        // Find user
        User user = userRepository.returnUser(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Find all patterns created by user
        return patternRepository.findCreatedByUserName(username);
    }

    @DeleteMapping("/deletepattern")
    public ResponseEntity<ApiResponse> deletePattern(@RequestParam String username, Integer patternId) {
        try {
            userPatternRepository.deletePattern(username, patternId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse("Pattern deleted", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Pattern could not be deleted: " +e.getMessage(), false));
        }
    }

    // Get user data
    @GetMapping("/getuserdata")
    public ProfileDataDTO getUserData(@RequestParam String username) {
        if (username != null) {
            // Create a DTO to return to frontend
            ProfileDataDTO userData = new ProfileDataDTO(username);
            userData.setInstagram(userService.getInstagram(username));
            userData.setYoutube(userService.getYoutube(username));
            userData.setLocation(userService.getLocation(username));
            userData.setJoin_date(userService.getJoinDate(username));
            userData.setImg_url(userService.getImgUrl(username));
            userData.setPatternCount(userService.getPatternCount(username)); // Number of patterns added by the user
            userData.setMostPopularPattern(userService.getMostPopularPattern(username)); // Pattern added most time by other users
            return userData;
        } else {
            return null;
        }
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/updateuserdata")
    public void updateUserData(@RequestParam String typeOfData, String data, String user) {
        userService.saveUserData(typeOfData, data, user);
        System.out.println("typeOfData = " + typeOfData);
        System.out.println("Data = " + data);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete")
    ResponseEntity<ApiResponse> deleteUser(@RequestParam String username) {
        try {
            userService.deleteByUserId(username);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse("User deleted", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("User could not be deleted: " +e.getMessage(), false));
        }
    }

    // Get user's notfications about new comments to patterns
    @GetMapping("/notifications")
    public List<Notification> getNotificationsForUser(@RequestParam String username) {
        try {
            return userService.getNotificationsByUsername(username);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return null;
        }
    }

    // Delete a user notification based on id
    @DeleteMapping("/notifications")
    public ResponseEntity<ApiResponse> deleteNotification(@RequestParam int notificationId) {
        try {
            userService.deleteNotificationById(notificationId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse("Notification deleted", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Notification could not be deleted " + e.getMessage(), false));
        }
    }
}

