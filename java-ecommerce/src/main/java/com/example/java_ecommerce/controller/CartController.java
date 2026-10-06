package com.example.java_ecommerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_ecommerce.dto.CartReqDto;
import com.example.java_ecommerce.dto.CartResDto;
import com.example.java_ecommerce.service.CartService;




@RestController 
@RequestMapping ("/api/cart")
public class CartController {
    private final CartService cartService;
    public CartController(CartService cartService){
        this.cartService = cartService;
    }

    @PostMapping
    public ResponseEntity<CartResDto> createCart(@RequestBody CartReqDto cartReqDto, Authentication authentication) {
        String email = authentication.getName();
        CartResDto cartResDto = cartService.createCart(cartReqDto, email);
        return ResponseEntity.status(201).body(cartResDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartResDto> getCartById(@PathVariable Long id) {
        CartResDto cartResDto = cartService.getCartById(id);
        return ResponseEntity.status(200).body(cartResDto);
    }
    @GetMapping
    public ResponseEntity<List<CartResDto>> getAllCarts(Authentication authentication){
        String email = authentication.getName();
        List<CartResDto> cartResDtos = cartService.getAllCarts(email);
        return ResponseEntity.status(200).body(cartResDtos);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CartResDto> updateCart(@PathVariable Long id, @RequestBody CartReqDto cartReqDto) {
        CartResDto cartResDto = cartService.updateCart(id, cartReqDto);
        return ResponseEntity.status(200).body(cartResDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        cartService.deleteCart(id);
        return ResponseEntity.status(204).build();
    }
}
