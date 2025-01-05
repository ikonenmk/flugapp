package com.example.flypatternlib.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
@Table
public class UserOrder {
        @Id
        private Integer id;
        private Integer total_cost;
        private LocalDate date;
        private final Set<PatternOrder> patterns = new HashSet<>();

        public void addPatterns(Pattern pattern) {
                this.patterns.add(new PatternOrder(pattern.getId()));
        }

        public Integer getId() {
                return id;
        }

        public void setId(Integer id) {
                this.id = id;
        }

        public Integer getTotal_cost() {
                return total_cost;
        }

        public void setTotal_cost(Integer total_cost) {
                this.total_cost = total_cost;
        }

        public LocalDate getDate() {
                return date;
        }

        public void setDate(LocalDate date) {
                this.date = date;
        }

        @Override
        public String toString() {
                StringBuilder sb = new StringBuilder();
                sb.append("UserOrder{")
                        .append("id= ").append(id)
                        .append(" , total cost = ").append(total_cost)
                        .append(" , date = ").append(date)
                        .append(" , patterns = [");

                //append each pattern in patterns to string
                for(PatternOrder patternOrder: patterns) {
                        sb.append(patternOrder.getPattern()).append(" , ");
                }

                sb.append("]}");
                return sb.toString();
        }
}
