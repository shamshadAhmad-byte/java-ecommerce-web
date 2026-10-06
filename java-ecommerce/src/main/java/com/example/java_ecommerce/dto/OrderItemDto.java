package com.example.java_ecommerce.dto;


public class OrderItemDto {

    private Long productId;
    private Integer quantity;

    public OrderItemDto() {}
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
