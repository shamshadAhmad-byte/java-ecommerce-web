package com.example.java_ecommerce.exception;

public class PasswordNotMatchesException extends RuntimeException{
    public PasswordNotMatchesException(String message){
        super(message);
    }
}
