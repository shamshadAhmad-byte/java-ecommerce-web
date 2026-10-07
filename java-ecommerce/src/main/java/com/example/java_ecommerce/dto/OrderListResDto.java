package com.example.java_ecommerce.dto;

import java.util.List;

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

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public List<OrderResDto> getOrders() {
        return orders;
    }

    public void setOrders(List<OrderResDto> orders) {
        this.orders = orders;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
