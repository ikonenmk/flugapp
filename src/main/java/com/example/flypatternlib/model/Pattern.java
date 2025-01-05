package com.example.flypatternlib.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Table
public class Pattern {
    @Id
    private Integer id;
    private String name;
    private String descr;
    private String instr;
    private Integer hook_size_from;
    private Integer hook_size_to;
    private String type;
    private String img_url;
    private Boolean for_sale;
    private Integer price;
    private String created_by_user;
    private LocalDateTime created;
    private Set<PatternMaterial> materials = new HashSet<>(); //materials in pattern
    private Set<PatternSpecies> species = new HashSet<>(); //species pattern is tied for

    public void addMaterial(Material material) {
        this.materials.add(new PatternMaterial(material.getId()));
    }

    public void addSpecies(Species species) {
        this.species.add(new PatternSpecies(species.getId()));
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescr() {
        return descr;
    }

    public void setDescr(String descr) {
        this.descr = descr;
    }

    public String getInstr() {
        return instr;
    }

    public void setInstr(String instr) {
        this.instr = instr;
    }

    public Integer getHook_size_from() {
        return hook_size_from;
    }

    public void setHook_size_from(Integer hook_size_from) {
        this.hook_size_from = hook_size_from;
    }

    public Integer getHook_size_to() {
        return hook_size_to;
    }

    public void setHook_size_to(Integer hook_size_to) {
        this.hook_size_to = hook_size_to;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getImg_url() {
        return img_url;
    }

    public void setImg_url(String img_url) {
        this.img_url = img_url;
    }

    public Boolean getFor_sale() {
        return for_sale;
    }

    public void setFor_sale(Boolean for_sale) {
        this.for_sale = for_sale;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public Set<PatternMaterial> getMaterials() {
        return materials;
    }

    public void setMaterials(Set<PatternMaterial> materials) {
        this.materials = materials;
    }

    public Set<PatternSpecies> getSpecies() {
        return species;
    }

    public void setSpecies(Set<PatternSpecies> species) {
        this.species = species;
    }

    public String getCreated_by_user() {
        return created_by_user;
    }

    public void setCreated_by_user(String created_by_user) {
        this.created_by_user = created_by_user;
    }
}
