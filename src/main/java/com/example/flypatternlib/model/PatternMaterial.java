package com.example.flypatternlib.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table
public class PatternMaterial {
        @Id
        Integer material;

        PatternMaterial(Integer material) {
                this.material = material;
        }

        public Integer getMaterial() {
                return material;
        }
}
