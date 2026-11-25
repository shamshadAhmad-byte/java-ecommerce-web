package com.example.java_ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class OrderStatusUpdateReqDto {
    private Long orderId;
    private Long itemId;
    private String status;

    public OrderStatusUpdateReqDto() {}

    public OrderStatusUpdateReqDto(Long orderId, Long itemId, String status) {
        this.orderId = orderId;
        this.itemId = itemId;
        this.status = status;
    }
}
