package com.example.java_ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.example.java_ecommerce.entity.ProductImage;
import com.example.java_ecommerce.entity.ProductSize;

public class ProductResDto {
    private Long id;
    private String name;
    private String description;
    private Integer price;
    private String category;
    private String subCategory;
    private boolean bestSeller;
    private LocalDateTime createdAt;
    private List<ProductImage> images;
    private List<ProductSize> sizes;
    private boolean success=true;
    public ProductResDto() {}
    public Long getId(){
        return id;
    }
    @JsonProperty("_id")
    public Long get_id(){
        return id;
    }
    public void setId(Long id){
        this.id=id;
    }
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
    @JsonProperty("bestseller")
    public boolean getBestseller(){
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
    public List<String> getImage() {
        if (images == null) return java.util.Collections.emptyList();
        return images.stream().map(ProductImage::getImageUrl).collect(java.util.stream.Collectors.toList());
    }
    public void setImages(List<ProductImage> images){
        this.images=images;
    }
    public List<ProductSize> getSizes(){
        return sizes;
    }
    public List<String> getSize() {
        if (sizes == null) return java.util.Collections.emptyList();
        return sizes.stream().map(ProductSize::getSize).collect(java.util.stream.Collectors.toList());
    }
    public void setSizes(List<ProductSize> sizes){
        this.sizes=sizes;
    }
    public boolean getSuccess(){
        return success;
    }
    public void setSuccess(boolean success){
        this.success=success;
    }
}
