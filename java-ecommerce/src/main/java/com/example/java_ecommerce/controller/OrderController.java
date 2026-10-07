package com.example.java_ecommerce.controller;

import java.util.List;
import java.util.Map;

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

import com.example.java_ecommerce.dto.OrderListResDto;
import com.example.java_ecommerce.dto.OrderReqDto;
import com.example.java_ecommerce.dto.OrderResDto;
import com.example.java_ecommerce.dto.OrderStatusUpdateReqDto;
import com.example.java_ecommerce.service.OrderService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping({"/api/orders", "/api/order"})
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

    @GetMapping({"", "/userorder", "/userorders"})
    public ResponseEntity<List<OrderResDto>> getUserOrders(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }

    @GetMapping({"/listorders", "/seller"})
    public ResponseEntity<OrderListResDto> listOrders(
            Authentication authentication,
            @RequestParam(value = "all", required = false) Boolean all) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(orderService.listOrders(email, all));
    }

    @PostMapping({"/updatestatus", "/status"})
    public ResponseEntity<Map<String, Object>> updateStatus(
            @RequestBody OrderStatusUpdateReqDto reqDto,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(orderService.updateOrderStatus(reqDto, email));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<OrderResDto>> getAllOrdersForAdmin(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin(email));
    }

    @PostMapping({"/verify-stripe", "/verifyorder"})
    public ResponseEntity<OrderResDto> verifyStripePayment(
            @RequestParam(value = "sessionId", required = false) String sessionId,
            @RequestParam(value = "session_id", required = false) String sessionIdSnake,
            @RequestBody(required = false) Map<String, Object> reqBody) {
        String finalSession = sessionId != null ? sessionId : sessionIdSnake;
        if (finalSession == null && reqBody != null) {
            if (reqBody.containsKey("sessionId")) finalSession = String.valueOf(reqBody.get("sessionId"));
            else if (reqBody.containsKey("session_id")) finalSession = String.valueOf(reqBody.get("session_id"));
            else if (reqBody.containsKey("orderId")) {
                try {
                    Long orderId = Long.valueOf(String.valueOf(reqBody.get("orderId")));
                    return ResponseEntity.ok(orderService.getOrderById(orderId));
                } catch (Exception ignored) {}
            }
        }
        if (finalSession == null || finalSession.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.verifyStripePayment(finalSession));
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