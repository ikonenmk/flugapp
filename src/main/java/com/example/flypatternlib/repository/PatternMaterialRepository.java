package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.PatternMaterial;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PatternMaterialRepository extends ListCrudRepository<PatternMaterial, Integer> {
    @Query("select * from pattern_material m where m.pattern = :pattern_id")
    List<PatternMaterial> findByPatternId(@Param("pattern_id") Integer pattern_id);
}
