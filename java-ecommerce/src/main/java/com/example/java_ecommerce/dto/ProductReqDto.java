package com.example.java_ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.java_ecommerce.entity.ProductImage;
import com.example.java_ecommerce.entity.ProductSize;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class ProductReqDto {

    @NotBlank(message="Name is required")
    @Size (max=100, message="Name must be less than or equal to 100 characters")
    private String name;

    @NotBlank(message="Description is required")
    @Size (max=500, message="Description must be less than or equal to 500 characters")
    private String description;

    @NotNull(message="Price is required")
    @Min (value=0, message="Price must be greater than or equal to 0")
    private Integer price;

    @NotBlank(message="Category is required")
    private String category;

    @NotBlank(message="Sub category is required")
    private String subCategory;

    private boolean bestSeller;

    private LocalDateTime createdAt;

    private List<ProductImage> images;

    private List<ProductSize> sizes;

    public ProductReqDto() {}
}
