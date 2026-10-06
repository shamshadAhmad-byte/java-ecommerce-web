package com.example.java_ecommerce.service.Payment;

import org.springframework.stereotype.Service;

import com.example.java_ecommerce.dto.PaymentResDto;
import com.example.java_ecommerce.entity.Order;
@Service("cod") 
public class CODPaymentService implements PaymentService {
    @Override 
    public PaymentResDto payment(Order order){
        order.setPaymentMethod("COD");
        order.setPaymentStatus("Pending");
        order.setStatus("PLACED");
        return new PaymentResDto.Builder()
                .withSuccess(true)
                .withPaymentMethod("COD")
                .withPaymentStatus("Pending")
                .withMessage("Cash on Delivery selected. Please prepare the payment upon delivery.")
                .build();
    }
}
