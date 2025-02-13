package com.example.flypatternlib.service;

import com.example.flypatternlib.repository.PageVisitCounterRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PageVisitCountService {
    private final PageVisitCounterRepository repository;

    public PageVisitCountService(PageVisitCounterRepository repository) {
        this.repository = repository;
    }
    public int incrementVisitorCount() {
        LocalDateTime now = LocalDateTime.now();
        repository.incrementVisitorCount(now);
        return repository.getNumberOfVisits();
    }
}
