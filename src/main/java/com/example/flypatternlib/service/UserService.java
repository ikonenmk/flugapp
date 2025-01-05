package com.example.flypatternlib.service;

import com.example.flypatternlib.model.Pattern;
import com.example.flypatternlib.model.UserRegRequest;
import com.example.flypatternlib.repository.PatternRepository;
import com.example.flypatternlib.repository.UserPatternRepository;
import com.example.flypatternlib.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    private final JdbcUserDetailsManager jdbcUserDetailsManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserPatternRepository userPatternRepository;
    private final PatternRepository patternRepository;

    public UserService(JdbcUserDetailsManager jdbcUserDetailsManager, PasswordEncoder passwordEncoder, UserRepository userRepository, UserPatternRepository userPatternRepository, PatternRepository patternRepository) {
        this.jdbcUserDetailsManager = jdbcUserDetailsManager;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.userPatternRepository = userPatternRepository;
        this.patternRepository = patternRepository;
    }

    public void addUser(UserRegRequest loginRequest) {
        // Add user
        UserDetails newUser = User.builder()
                .username(loginRequest.username())
                .password(passwordEncoder.encode(loginRequest.password()))
                .roles("USER")
                .build();
        jdbcUserDetailsManager.createUser(newUser);

        // Add user's email
        String sql = "INSERT INTO user_emails (user, email) VALUES (?, ?)";
        assert jdbcUserDetailsManager.getJdbcTemplate() != null;
        jdbcUserDetailsManager.getJdbcTemplate().update(sql, loginRequest.username(), loginRequest.email());
        
        // Add joined date to user data table
        LocalDateTime dateAndTime = LocalDateTime.now();
        String sqlString = "INSERT INTO user_data (user, join_date) VALUES (?, ?)";
        assert jdbcUserDetailsManager.getJdbcTemplate() != null;
        jdbcUserDetailsManager.getJdbcTemplate().update(sqlString, loginRequest.username(), dateAndTime);
    }
    // Update user password
    public void updatePassword(String username, String newPassword) {
        if (!jdbcUserDetailsManager.userExists(username)) {
            throw new RuntimeException("User does not exist: " + username);
        }

        // Load user
        UserDetails existingUser = jdbcUserDetailsManager.loadUserByUsername(username);
        System.out.print("username" +username);
        System.out.print("newPassword" +newPassword);
        String newToken = passwordEncoder.encode(newPassword);
        System.out.print("token: " + newToken);


        // Create new object with updated password
        UserDetails updatedUser = User.builder()
                .username(existingUser.getUsername())
                .password(passwordEncoder.encode(newPassword)) // Encode the new password
                .roles(existingUser.getAuthorities()
                        .stream()
                        .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                        .toArray(String[]::new)) // Maintain existing roles
                .build();

        // Update the user
        jdbcUserDetailsManager.updateUser(updatedUser);
    }

    // Method for looking up if a username exists, returns true or false
    public boolean findUser(String username) {
        try {
           UserDetails user = jdbcUserDetailsManager.loadUserByUsername(username);
           return true;
        } catch (UsernameNotFoundException error) {
            System.out.println(error.getMessage());
            return false;
        }
    }

    public String findUsernameByEmail(String email) {
        return userRepository.findUsernameByEmail(email);
    }

    public Boolean findEmail(String email) {
        try {
            int doesExist = userRepository.findEmail(email);
            return doesExist > 0;
        } catch (Exception e) {
            System.err.println("Error in findEmail: " + e.getMessage());
            return false;
        }
    }

    // Find email by username
    public String findEmailByUsername(String username) {
        return userRepository.findEmailByUserName(username);
    }

    public String getInstagram(String username) {
        String insta = userRepository.getInstagram(username);

        // Return empty string if value of insta is "null"
        if (Objects.equals(insta, "null")) {
            return "";
        } else {
            return insta;  // Return value if not "null"
        }
    }

    public String getYoutube(String username) {
        String youtube = userRepository.getYoutube(username);
        // Return empty string if value of insta is "null" or empty
        if (Objects.equals(youtube, "null")) {
            return "";
        } else {
            return youtube;  // Return value if not "null"
        }
    }

    public String getLocation(String username) {
        String loc = userRepository.getLocation(username);
        // Return empty string if value of insta is "null"
        if (Objects.equals(loc, "null")) {
            return "";
        } else {
            return loc;  // Return value if not "null"
        }
    }

    public LocalDateTime getJoinDate(String username) {
        return userRepository.getJoinDate(username);
    }

    public int getPatternCount(String username) {
        return patternRepository.getPatternCount(username);
    }

    public String getImgUrl(String username) {
        return userRepository.getImgUrl(username);
    }

    public int getMostPopularPattern(String username) {
        int count = getPatternCount(username);
        if(count > 0) {
            Integer mostPopular = patternRepository.getMostPopularPattern(username);
            if (mostPopular == null) {
                return 0;
            } else {
                return mostPopular;
            }
        } else {
            return 0;
        }

    }

    public void saveUserData(String typeOfData, String data, String user) {
        if(Objects.equals(typeOfData, "location")) {
            userRepository.saveLocation(data, user);
        } else if (Objects.equals(typeOfData, "instagram")) {
            userRepository.saveInstagram(data, user);
        } else if (Objects.equals(typeOfData, "youtube")) {
            userRepository.saveYoutube(data, user);
        } else if(Objects.equals(typeOfData, "img_url")) {
            userRepository.saveImgUrl(data, user);
        } else {
            System.out.println("Data type not recognised");
        }
    }


}

