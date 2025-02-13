package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.PageVisitCount;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PageVisitCounterRepository extends ListCrudRepository<PageVisitCount, Integer> {

    // Increment counter
    @Modifying
    @Query("UPDATE page_visit_counter SET number_of_visits = number_of_visits + 1, last_time_visited = :dateOfThisVisit WHERE id = 1")
    void incrementVisitorCount(@Param("dateOfThisVisit")LocalDateTime dateOfThisVisit);

    // Get counter value
    @Query("SELECT number_of_visits FROM page_visit_counter WHERE id = 1")
    int getNumberOfVisits();
}
