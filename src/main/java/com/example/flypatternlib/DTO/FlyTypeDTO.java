package com.example.flypatternlib.DTO;


//Class for transferring partial data from Pattern model to frontend
public class FlyTypeDTO {
    private int id;
    private String name;

    public FlyTypeDTO(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
