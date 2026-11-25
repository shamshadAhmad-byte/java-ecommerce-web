package com.example.java_ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class OrderItemDto {

    private Long productId;
    private int quantity;
    private String size;

    public OrderItemDto() {}
}
