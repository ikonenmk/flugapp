package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.RestoreToken;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TokenRepository extends ListCrudRepository<RestoreToken, Integer> {
    @Query("SELECT email FROM restore_token rt WHERE rt.token_string = :tokenString")
    String findEmailByToken(String tokenString);

    @Modifying
    @Query("DELETE FROM restore_token WHERE id = :id")
    int delete(int id);

    @Query("SELECT id FROM restore_token rt WHERE rt.email = :email")
    List<Integer> returnIds(String email);

    @Query("SELECT COUNT(*) FROM restore_token WHERE token_string = :token")
    int tokenExists(String token);
}

