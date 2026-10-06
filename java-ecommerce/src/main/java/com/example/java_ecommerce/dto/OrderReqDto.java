package com.example.java_ecommerce.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

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

    public OrderReqDto() {}

    public List<OrderItemDto> getOrderItemDtos() {
        return orderItemDtos;
    }
    public void setOrderItemDtos(List<OrderItemDto> orderItemDtos) {
        this.orderItemDtos = orderItemDtos;
    }
    public Double getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    public AddressDto getShippingAddress() {
        return shippingAddress;
    }
    public void setShippingAddress(AddressDto shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
}
