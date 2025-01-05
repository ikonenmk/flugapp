package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.PatternSpecies;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatternSpeciesRepository extends ListCrudRepository<PatternSpecies, Integer> {
    // Find by patternId
    @Query("select * from pattern_species where pattern = :patternId")
    List<PatternSpecies> findByPatternId(Integer patternId);
}
