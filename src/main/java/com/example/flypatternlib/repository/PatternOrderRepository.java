package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.PatternOrder;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PatternOrderRepository extends ListCrudRepository<PatternOrder, Integer> {
}
