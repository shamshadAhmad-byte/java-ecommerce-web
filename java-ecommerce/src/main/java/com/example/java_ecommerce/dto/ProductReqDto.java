package com.example.java_ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.java_ecommerce.entity.ProductImage;
import com.example.java_ecommerce.entity.ProductSize;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name=name;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description=description;
    }
    public Integer getPrice(){
        return price;
    }
    public void setPrice(Integer price){
        this.price=price;
    }
    public String getCategory(){
        return category;
    }
    public void setCategory(String category){
        this.category=category;
    }
    public String getSubCategory(){
        return subCategory;
    }
    public void setSubCategory(String subCategory){
        this.subCategory=subCategory;
    }
    public boolean isBestSeller(){
        return bestSeller;
    }
    public void setBestSeller(boolean bestSeller){
        this.bestSeller=bestSeller;
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt){
        this.createdAt=createdAt;
    }
    public List<ProductImage> getImages(){
        return images;
    }
    public void setImages(List<ProductImage> images){
        this.images=images;
    }
    public List<ProductSize> getSizes(){
        return sizes;
    }
    public void setSizes(List<ProductSize> sizes){
        this.sizes=sizes;
    }
}
