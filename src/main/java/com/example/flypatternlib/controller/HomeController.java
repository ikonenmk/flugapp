package com.example.flypatternlib.controller;

import com.example.flypatternlib.service.PageVisitCountService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class HomeController {
    private final PageVisitCountService service;

    public HomeController(PageVisitCountService service) {
        this.service = service;
    }

    @GetMapping("/count")
    public int incrementVisitorCount() {
        return service.incrementVisitorCount();
    }

}