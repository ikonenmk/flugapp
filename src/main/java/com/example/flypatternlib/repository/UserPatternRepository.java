package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.UserPattern;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPatternRepository extends ListCrudRepository<UserPattern, Integer> {

    // Check if userpattern already exists, return true if existing
    @Query("SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END AS 'condition_met' FROM user_pattern WHERE user_pattern.pattern = :patternId AND user_pattern.users = :username")
    boolean patternExist(String username, Integer patternId);

    // Find all connections between a username and pattern ids
    @Query("SELECT pattern FROM user_pattern WHERE user_pattern.users = :username")
    List<Integer> findByUserName(String username);

    // Delete a user pattern
    @Modifying
    @Query("DELETE FROM user_pattern WHERE users = :username AND pattern = :patternId")
    void deletePattern(String username, Integer patternId);

    @Query("SELECT COUNT(*) FROM user_pattern WHERE pattern = :pattern_id")
    int countUsers(int pattern_id);


}
