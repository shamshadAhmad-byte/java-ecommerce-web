package com.example.java_ecommerce.service.Payment;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service 
public class PaymentFactoryService {
    private final Map<String, PaymentService>paymentServices;
    
    public PaymentFactoryService(Map <String,PaymentService> paymentServices) {
        this.paymentServices = paymentServices;
    }
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
