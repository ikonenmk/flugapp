package com.example.flypatternlib.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table
public class PatternOrder {
    @Id
    Integer pattern;

    public PatternOrder(Integer pattern) {
        this.pattern = pattern;
    }

    public Integer getPattern() {
        return pattern;
    }
}
