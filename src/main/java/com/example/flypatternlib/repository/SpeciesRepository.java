package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.Species;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SpeciesRepository extends ListCrudRepository<Species, Integer> {

    //Find species by name
    @Query("select* from species s where s.name =:name")
    Species findByName(@Param("name") String objectName);
}
