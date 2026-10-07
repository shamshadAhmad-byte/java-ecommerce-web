package com.example.java_ecommerce.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_ecommerce.dto.UserReqDto;
import com.example.java_ecommerce.dto.UserResDto;
import com.example.java_ecommerce.service.JwtService;
import com.example.java_ecommerce.service.UserService;

import jakarta.validation.Valid;


@RestController 
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;
    public UserController(UserService userService, JwtService jwtService){
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signin")
    public ResponseEntity<UserResDto> userSignIn(@Valid @RequestBody UserReqDto userReqDto){
        UserResDto userResDto = userService.userSignIn(userReqDto);
        jwtService.generateToken(userResDto);
        return ResponseEntity.ok(userResDto);
    }
    @PostMapping("/signup")
    public ResponseEntity<UserResDto> userSignUp(@Valid @RequestBody UserReqDto userReqDto){
        UserResDto userResDto = userService.userSignUp(userReqDto);
        jwtService.generateToken(userResDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResDto);
    }
    @GetMapping
    public ResponseEntity<UserResDto> getUserById(Authentication authentication){
        UserResDto userResDto = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.status(HttpStatus.OK).body(userResDto);
    }
    @PutMapping
    public ResponseEntity<UserResDto> updateUser(Authentication authentication, @RequestBody UserReqDto userReqDto){
        UserResDto userResDto = userService.updateUser(authentication.getName(), userReqDto);
        jwtService.generateToken(userResDto);
        return ResponseEntity.status(HttpStatus.OK).body(userResDto);
    }
}
