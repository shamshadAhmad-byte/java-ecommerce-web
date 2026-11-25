package com.example.java_ecommerce.service.Payment;

import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class PaymentFactoryService {
    private final Map<String, PaymentService>paymentServices;
    
    public PaymentService getPaymentService(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new IllegalArgumentException(
                    "Payment method is required");
        }
        PaymentService service =paymentServices.get(paymentMethod.toLowerCase());
        if (service == null) {
            throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        }
        return service;
    }
}
