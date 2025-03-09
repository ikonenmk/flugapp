package com.example.flypatternlib.repository;

import com.example.flypatternlib.model.Notification;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationsRepository extends ListCrudRepository<Notification, Integer> {

    @Query("SELECT * FROM notifications WHERE username = :username")
    List<Notification> findAllByUsername(String username);

}
