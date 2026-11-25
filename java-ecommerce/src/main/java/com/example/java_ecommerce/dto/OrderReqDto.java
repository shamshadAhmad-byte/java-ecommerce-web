package com.example.java_ecommerce.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class OrderReqDto {
    @NotNull(message = "Order items are required")
    @Valid
    private List<OrderItemDto> orderItemDtos;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    private Double totalAmount;

    @NotBlank(message = "Payment method is required (e.g., 'stripe' or 'cod')")
    private String paymentMethod;

    @Valid
    @NotNull(message = "Shipping address is required")
    private AddressDto shippingAddress;

    private String successUrl;
    private String cancelUrl;

    public OrderReqDto() {}


}
