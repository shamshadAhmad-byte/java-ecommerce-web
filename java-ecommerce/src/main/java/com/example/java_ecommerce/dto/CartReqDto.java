package com.example.java_ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class CartReqDto {

    @NotNull(message="product is required")
    private Long productId;

    @NotBlank(message="size is required")
    private String size;

    @NotNull(message="quantity is required")
    @Min(value = 1, message = "quantity must be at least 1")
    private Long quantity;
}
