package com.example.java_ecommerce.exception;

public class UserNotAuthorizeException extends RuntimeException {
    public UserNotAuthorizeException(String message) {
        super(message);
    }
}
