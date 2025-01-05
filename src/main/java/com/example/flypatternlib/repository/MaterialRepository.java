package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.Material;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MaterialRepository extends ListCrudRepository<Material, Integer> {

    //Find material by name
    @Query("select * from material m where m.name = :name")
    Material findByName(@Param("name") String objectName);

    @Query("select * from material m where m.pattern = :pattern_id")
    List<Material> findByPatternId(@Param("pattern_id") Integer pattern_id);
}
