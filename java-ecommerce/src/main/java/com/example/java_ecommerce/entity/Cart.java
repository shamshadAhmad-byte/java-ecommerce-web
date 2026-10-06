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
import jakarta.validation.constraints.Min;


@Entity 
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String size;
    @Min(0)
    private Long quantity;
    private String sessionId;
    @JsonIgnore
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;
    @JsonIgnore
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="product_id")
    private Product product;
    public Cart(){}
    public Long getId(){
        return id;
    }
    public String getSize(){
        return size;
    }
    public void setSize(String size){
        this.size=size;
    }
    public Long getQuantity(){
        return quantity;
    }
    public void setQuantity(Long quantity){
        this.quantity=quantity;
    }
    public String getSessionId(){
        return sessionId;
    }
    public void setSessionId(String sessionId){
        this.sessionId = sessionId;
    }
    public User getUser(){
        return user;
    }
    public void setUser(User user){
        this.user=user;
    }
    public Product getProduct(){
        return product;
    }
    public void setProduct(Product product){
        this.product=product;
    }
}
