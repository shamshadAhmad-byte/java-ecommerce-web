package com.example.java_ecommerce.service.Payment;

import org.springframework.stereotype.Service;

import com.example.java_ecommerce.dto.PaymentResDto;
import com.example.java_ecommerce.entity.Order;
@Service 
public interface PaymentService {
    PaymentResDto payment(Order order);
}
