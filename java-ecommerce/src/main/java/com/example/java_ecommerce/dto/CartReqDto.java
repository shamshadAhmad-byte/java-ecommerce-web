package com.example.java_ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CartReqDto {

    @NotNull(message="product is required")
    private Long productId;

    @NotBlank(message="size is required")
    private String size;

    @NotNull(message="quantity is required")
    @Min(value = 1, message = "quantity must be at least 1")
    private Long quantity;

    public Long getProductId() {
        return productId;
    }   

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }
    public String getSize() {
        return size;
    }
    public void setSize(String size) {
        this.size = size;
    }
}
