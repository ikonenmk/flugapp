package com.example.flypatternlib.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("comments")
public class Comment {
    @Id
    private Integer id;
    private String username; // Username of user posting the comment
    private LocalDateTime timeOfPosting;
    private int patternId; // Id for pattern that is being commented
    private String commentText;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getTimeOfPosting() {
        return timeOfPosting;
    }

    public void setTimeOfPosting(LocalDateTime timeOfPosting) {
        this.timeOfPosting = timeOfPosting;
    }

    public int getPatternId() {
        return patternId;
    }

    public void setPatternId(int patternId) {
        this.patternId = patternId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }
}
