package com.example.java_ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_ecommerce.dto.OrderReqDto;
import com.example.java_ecommerce.dto.OrderResDto;
import com.example.java_ecommerce.service.OrderService;

import jakarta.validation.Valid;
@RestController 
@RequestMapping("/api/orders")
public class OrderController{
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResDto> createOrder(@Valid @RequestBody OrderReqDto orderReqDto, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        OrderResDto orderResDto = orderService.createOrder(orderReqDto, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<OrderResDto>> getUserOrders(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }

    @PostMapping("/verify-stripe")
    public ResponseEntity<OrderResDto> verifyStripePayment(@RequestParam("sessionId") String sessionId) {
        return ResponseEntity.ok(orderService.verifyStripePayment(sessionId));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        try {
            orderService.handleStripeWebhook(payload, sigHeader);
            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error: " + e.getMessage());
        }
    }
}