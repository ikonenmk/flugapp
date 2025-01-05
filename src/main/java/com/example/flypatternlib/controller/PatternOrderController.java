package com.example.flypatternlib.controller;

import com.example.flypatternlib.repository.PatternOrderRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patternorder")
public class PatternOrderController {
    private final PatternOrderRepository repository;

    public PatternOrderController(PatternOrderRepository repository) {
        this.repository = repository;
    }
}
