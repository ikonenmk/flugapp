package com.example.flypatternlib.response;

// Class for returning useful information about api requests to frontend
public class ApiResponse {
    private String message;
    private boolean success;

    public ApiResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public String getMessage() {
        return message;
    }
    public boolean isSuccess() {
        return success;
    }
}
