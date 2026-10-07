package com.example.java_ecommerce.dto;

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

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
