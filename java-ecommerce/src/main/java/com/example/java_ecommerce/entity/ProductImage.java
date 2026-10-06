package com.example.java_ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String imageUrl;
    private String publicId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    public ProductImage(){}
    public ProductImage(String imageUrl, String publicId, Product product){
        this.imageUrl=imageUrl;
        this.publicId=publicId;
        this.product=product;
    }
    public Long getId(){
        return id;
    }
    public String getImageUrl(){
        return imageUrl;
    }
    public void setImageUrl(String imageUrl){
        this.imageUrl=imageUrl;
    }
    public String getPublicId(){
        return publicId;
    }
    public void setPublicId(String publicId){
        this.publicId=publicId;
    }
    public Product getProduct(){
        return product;
    }
    public void setProduct(Product product){
        this.product=product;
    }
}
