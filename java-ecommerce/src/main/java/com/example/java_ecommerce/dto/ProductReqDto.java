package com.example.java_ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.java_ecommerce.entity.ProductImage;
import com.example.java_ecommerce.entity.ProductSize;


public class ProductReqDto {
    private String name;
    private String description;
    private Integer price;
    private String category;
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
