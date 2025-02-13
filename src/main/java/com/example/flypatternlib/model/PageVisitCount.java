package com.example.flypatternlib.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table
public class PageVisitCount {
    @Id
    private Integer id;
    private LocalDateTime lastTimeVisited;
    private int numberOfVisits;

    public LocalDateTime getLastTimeVisited() {
        return lastTimeVisited;
    }

    public void setLastTimeVisited(LocalDateTime lastTimeVisited) {
        this.lastTimeVisited = lastTimeVisited;
    }

    public int getNumberOfVisits() {
        return numberOfVisits;
    }

    public void setNumberOfVisits(int numberOfVisits) {
        this.numberOfVisits = numberOfVisits;
    }
}
