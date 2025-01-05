package com.example.flypatternlib.controller;
import com.example.flypatternlib.model.Pattern;
import com.example.flypatternlib.model.User;
import com.example.flypatternlib.model.UserOrder;
import com.example.flypatternlib.repository.PatternRepository;
import com.example.flypatternlib.repository.UserOrderRepository;
import com.example.flypatternlib.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/userorder")
public class UserOrderController {
    private final UserOrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PatternRepository patternRepository;

    public UserOrderController(UserOrderRepository orderRepository, UserRepository userRepository, PatternRepository patternRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.patternRepository = patternRepository;
    }

    // Wrapper class for addOrder requests
    public static class OrderRequestWrapper {
        private UserOrder userOrder;
        private List<Integer> patternIds;

        public UserOrder getUserOrder() {
            return userOrder;
        }

        public List<Integer> getPatternIds() {
            return patternIds;
        }
    }
    // Add new order
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public void addOrder(@RequestBody OrderRequestWrapper orderRequestWrapper, @RequestParam Integer user_id) {
        UserOrder userOrder = orderRequestWrapper.getUserOrder();
        List<Integer> patternIds = orderRequestWrapper.getPatternIds();

        // Save order to user
        User user = userRepository.findById(user_id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));
        user.addOrder(userOrder);
        userRepository.save(user);

        // Add all patterns to order and save order
        patternIds.forEach(patternId -> {
            Pattern pattern = patternRepository.findById(patternId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "pattern not found"));
            userOrder.addPatterns(pattern);
            orderRepository.save(userOrder);
        });
    }

    // Find order
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @GetMapping("/{order_id}")
    public Optional<UserOrder> findOrder(@PathVariable Integer order_id) {
        //Find order by id, return if non-empty
        Optional<UserOrder> foundOrder = orderRepository.findById(order_id);
        if(foundOrder.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        } else {
            System.out.println(foundOrder);
            return foundOrder;
        }

    }
}
