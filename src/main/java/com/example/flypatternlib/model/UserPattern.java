package com.example.flypatternlib.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table
public class UserPattern {
    @Id
    private Integer pattern;
    private String users;

    public UserPattern(Integer pattern, String users) {
        this.pattern = pattern;
        this.users = users;
    }

    public Integer getPattern() {
        return pattern;
    }

    public void setPattern(Integer pattern) {
        this.pattern = pattern;
    }

    public String getUsername() {
        return users;
    }

    public void setUsername(String users) {
        this.users = users;
    }
}
