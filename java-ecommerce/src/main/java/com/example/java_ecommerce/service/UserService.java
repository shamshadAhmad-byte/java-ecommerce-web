package com.example.java_ecommerce.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.java_ecommerce.dto.UserReqDto;
import com.example.java_ecommerce.dto.UserResDto;
import com.example.java_ecommerce.entity.User;
import com.example.java_ecommerce.exception.DuplicateExceptionHandler;
import com.example.java_ecommerce.exception.PasswordNotMatchesException;
import com.example.java_ecommerce.exception.ResourceNotFoundException;
import com.example.java_ecommerce.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

@Service 
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
    }
    
    public UserResDto userSignUp(UserReqDto userReqDto){
        if(userReqDto.getName() == null || userReqDto.getName().trim().isEmpty()){
            throw new IllegalArgumentException("Name is required");
        }
        if(existingUser(userReqDto.getEmail())){
            throw new DuplicateExceptionHandler("User with email "+userReqDto.getEmail()+" already exists");
        }
        User user=changeUserFromReqDto(userReqDto);
        User savedUser=userRepository.save(user);
        return changeUserToResDto(savedUser);
    }

    public UserResDto userSignIn(UserReqDto userReqDto){
        User existingUser=userRepository.findByEmail(userReqDto.getEmail());
        if(existingUser == null){
            throw new ResourceNotFoundException("User with email "+userReqDto.getEmail()+" not found");
        }
        if(!passwordEncoder.matches(userReqDto.getPassword(), existingUser.getPassword())){
            throw new PasswordNotMatchesException("Password does not match for user with email "+userReqDto.getEmail());
        }
        return changeUserToResDto(existingUser);
    }

    @Transactional(readOnly = true)
    public UserResDto getUserByEmail(String email){
        User existingUser=userRepository.findByEmail(email);
        if(existingUser == null){
            throw new ResourceNotFoundException("User with email "+email+" not found");
        }
        return changeUserToResDto(existingUser);
    }

    public UserResDto updateUser(String email, UserReqDto userReqDto){
        User existingUser=userRepository.findByEmail(email);
        if(existingUser == null){
            throw new ResourceNotFoundException("User with email "+email+" not found");
        }
        if(userReqDto.getName() != null && !userReqDto.getName().trim().isEmpty()){
            existingUser.setName(userReqDto.getName().trim());
        }
        if(userReqDto.getEmail() != null && !userReqDto.getEmail().trim().isEmpty() 
                && !userReqDto.getEmail().trim().equalsIgnoreCase(existingUser.getEmail())){
            if(existingUser(userReqDto.getEmail().trim())){
                throw new DuplicateExceptionHandler("User with email "+userReqDto.getEmail()+" already exists");
            }
            existingUser.setEmail(userReqDto.getEmail().trim());
        }
        if(userReqDto.getPassword() != null && !userReqDto.getPassword().trim().isEmpty()){
            existingUser.setPassword(passwordEncoder.encode(userReqDto.getPassword()));
        }
        existingUser.setUpdatedAt(LocalDateTime.now());
        User updatedUser=userRepository.save(existingUser);
        return changeUserToResDto(updatedUser);
    }
    
    private User changeUserFromReqDto(UserReqDto userReqDto){
        User user=new User();
        user.setName(userReqDto.getName() != null ? userReqDto.getName().trim() : "");
        user.setEmail(userReqDto.getEmail() != null ? userReqDto.getEmail().trim() : "");
        user.setPassword(passwordEncoder.encode(userReqDto.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        String role = userReqDto.getRole();
        if (role == null || role.trim().isEmpty()) {
            role = "USER";
        } else {
            role = role.trim().toUpperCase();
            if (role.startsWith("ROLE_")) {
                role = role.substring(5);
            }
        }
        user.setRole(role);
        return user;
    }
    private UserResDto changeUserToResDto(User user){
        UserResDto userResDto=new UserResDto();
        userResDto.setId(user.getId());
        userResDto.setName(user.getName());
        userResDto.setEmail(user.getEmail());
        userResDto.setCreatedAt(user.getCreatedAt());
        userResDto.setUpdatedAt(user.getUpdatedAt());
        userResDto.setRole(user.getRole());
        return userResDto;
    }
    private boolean existingUser(String email){
        return userRepository.existsByEmail(email);
    }
}
