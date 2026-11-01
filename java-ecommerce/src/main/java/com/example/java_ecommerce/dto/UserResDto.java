package com.example.java_ecommerce.dto;

import java.time.LocalDateTime;

public class UserResDto {
    private boolean success = true;
    private Long id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String token;
    private String role;
    public UserResDto(){};
    public boolean isSuccess(){
        return success;
    }
    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public String getEmail(){
        return email;
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }
    public String getToken(){
        return token;
    }
    public void setToken(String token){
        this.token=token;
    }
    public String getRole(){
        return role;
    }
    public static class Builder{
        private final UserResDto userResDto;
        public Builder(){
            userResDto=new UserResDto();
        }
        public Builder withSucess(boolean success){
            userResDto.success=success;
            return this;
        }
        public Builder withId(Long id){
            userResDto.id=id;
            return this;
        }
        public Builder withName(String name){
            userResDto.name=name;
            return this;
        }
        public Builder withEmail(String email){
            userResDto.email=email;
            return this;
        }
        public Builder withCreatedAt(LocalDateTime createdAt){
            userResDto.createdAt=createdAt;
            return this;
        }
        public Builder withUpdatedAt(LocalDateTime updatedAt){
            userResDto.updatedAt=updatedAt;
            return this;
        }
        public Builder withToken(String token){
            userResDto.token=token;
            return this;
        }
        public Builder withRole(String role){
            userResDto.role=role;
            return this;
        }
        public UserResDto build(){
            return userResDto;
        }
    }
}
