package com.example.java_ecommerce.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter 
@Setter 
public class OrderListResDto {
    private boolean success = true;
    private List<OrderResDto> orders;
    private String message;

    public OrderListResDto() {}

    public OrderListResDto(boolean success, List<OrderResDto> orders, String message) {
        this.success = success;
        this.orders = orders;
        this.message = message;
    }
}
