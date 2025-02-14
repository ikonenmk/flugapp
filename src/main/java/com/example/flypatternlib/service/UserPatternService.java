package com.example.flypatternlib.service;

import com.example.flypatternlib.repository.UserPatternRepository;
import org.springframework.stereotype.Service;

@Service
public class UserPatternService {
    final UserPatternRepository patternRepository;

    public UserPatternService(UserPatternRepository patternRepository) {
        this.patternRepository = patternRepository;
    }

    public int timesAdded(int pattern_id) {
        int number = patternRepository.countUsers(pattern_id);
        return number;
    }
}
