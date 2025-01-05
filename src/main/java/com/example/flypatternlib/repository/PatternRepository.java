package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.Pattern;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PatternRepository extends ListCrudRepository<Pattern, Integer> {

    //Find pattern by type
    @Query("select type from pattern p where p.type = :type")
    List<Pattern> findByType(@Param("type") String type);

    //Find all types of fly
    @Query("select type from pattern")
    List<String> findAllTypes();

    // Find flies by name
    @Query("select * from pattern p where p.name = :name")
    List<Pattern> findByName(@Param("name") String name);

    // Find patterns based on created by username
    @Query("select * from pattern p where p.created_by_user =:username")
    List<Pattern> findCreatedByUserName(String username);

    @Query("select created_by_user from pattern")
    List<String> findAllCreators();

    // Return number of patterns added by the user
    @Query("SELECT COUNT(*) FROM pattern p WHERE p.created_by_user = :username")
    int getPatternCount(String username);

    // Return the id of the pattern that has been added by most users
    @Query("SELECT id AS pattern_id FROM (\n" +
            "    SELECT \n" +
            "        COUNT(up.pattern) AS pattern_count,\n" +
            "        p.id\n" +
            "    FROM flypatterndb.user_pattern up\n" +
            "    INNER JOIN flypatterndb.pattern p \n" +
            "        ON p.id = up.pattern\n" +
            "    WHERE p.created_by_user = :username\n" +
            "    GROUP BY p.id\n" +
            ") AS subquery\n" +
            "WHERE pattern_count = (\n" +
            "    SELECT MAX(pattern_count)\n" +
            "    FROM (\n" +
            "        SELECT \n" +
            "            COUNT(up.pattern) AS pattern_count\n" +
            "        FROM flypatterndb.user_pattern up\n" +
            "        INNER JOIN flypatterndb.pattern p \n" +
            "            ON p.id = up.pattern\n" +
            "        WHERE p.created_by_user = :username\n" +
            "        GROUP BY p.id\n" +
            "    ) AS max_query\n" +
            ") LIMIT 1")
    Integer getMostPopularPattern(String username);
}
