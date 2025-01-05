package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.User;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends ListCrudRepository<User, Integer> {

    // Find user by username
    @Query("SELECT username FROM users u WHERE u.username = :username")
    String findByUserName(String username);

    // Return user data
    @Query("SELECT * FROM users u WHERE u.username = :username")
    Optional<User> returnUser(String username);

    // Find email

    @Query("SELECT COUNT(*) FROM user_emails ue WHERE ue.email = :email")
    int findEmail(String email);

    // Find username by email
    @Query("SELECT user FROM user_emails ue WHERE ue.email = :email")
    String findUsernameByEmail(String email);

    // Find email by username
    @Query("SELECT email FROM user_emails ue WHERE ue.user = :user")
    String findEmailByUserName(String user);

    // Find instagram in user's user data
    @Query("SELECT instagram FROM user_data ud WHERE ud.user = :user")
    String getInstagram(String user);

    // Find youtube in user's user data
    @Query("SELECT youtube FROM user_data ud WHERE ud.user = :username")
    String getYoutube(String username);

    // Find location in user's user data
    @Query("SELECT location FROM user_data ud WHERE ud.user = :username")
    String getLocation(String username);

    // Find date joined in user's user data
    @Query("SELECT join_date FROM user_data ud WHERE ud.user = :username")
    LocalDateTime getJoinDate(String username);

    // Save a new location for user
    @Modifying
    @Query("UPDATE user_data ud SET ud.location = :data WHERE ud.user = :user")
    void saveLocation(String data, String user);

    // Save a new instagram link for user
    @Modifying
    @Query("UPDATE user_data ud SET ud.instagram = :data WHERE ud.user = :user")
    void saveInstagram(String data, String user);

    // Save a new youtube link for user
    @Modifying
    @Query("UPDATE user_data ud SET ud.youtube = :data WHERE ud.user = :user")
    void saveYoutube(String data, String user);

    @Modifying
    @Query("UPDATE user_data ud SET ud.img_url = :data WHERE ud.user = :user")
    void saveImgUrl(String data, String user);

    @Query("SELECT img_url FROM user_data ud WHERE ud.user = :username")
    String getImgUrl(String username);
}