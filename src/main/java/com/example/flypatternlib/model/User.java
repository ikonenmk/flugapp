package com.example.flypatternlib.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;
import java.util.HashSet;
import java.util.Set;
@Table("users")
public class User {
    @Id
    private String username;
    private String password;
    private boolean enabled;
    @MappedCollection(idColumn = "users")
    private Set<UserPattern> patterns = new HashSet<>(); //Patterns that user has added in library
    @MappedCollection(idColumn = "user")
    private Set<UserOrder> orders = new HashSet<>();

    public void addPattern(Pattern pattern) {
        this.patterns.add(new UserPattern(pattern.getId(), username));
    }

    public void addOrder(UserOrder orders) {
        this.orders.add(orders);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Set<UserPattern> getPatterns() {
        return patterns;
    }

    public Set<UserOrder> getOrders() {
        return orders;
    }

    public void setPatterns(Set<UserPattern> patterns) {
        this.patterns = patterns;
    }

    public void setOrders(Set<UserOrder> orders) {
        this.orders = orders;
    }



}

