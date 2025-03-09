package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.Comment;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends ListCrudRepository<Comment, Integer> {

    @Query("SELECT * FROM comments WHERE pattern_id = :patternId")
    List<Comment> getCommentsForPattern(int patternId);
}
