package com.example.java_ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserReqDto {

    @NotBlank(message="Name is required")
    @Size(min=3,max=50,message="Name must be between 3 and 50 characters")
    private String name;

    @NotBlank(message="Email is required")
    @Email(message="Email is invalid")
    private String email;

    @NotBlank(message="Password is required")
    @Size(min=6,max=20,message="Password must be between 6 and 20 characters")
    private String password;

    @NotBlank(message="Role is required")
    private String role;
    public UserReqDto(){};
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name=name;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email=email;
    }
    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password=password;
    }
    public String getRole(){
        return role;
    }
    public void setRole(String role){
        this.role=role;
    }
}
