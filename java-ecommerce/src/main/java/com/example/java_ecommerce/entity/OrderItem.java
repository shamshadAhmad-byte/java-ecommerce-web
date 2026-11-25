package com.example.java_ecommerce.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity 
@Table(name = "order_items")
@Getter 
@Setter 
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product products;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;
    private Integer quantity;
    private Double price;
    private String size;
    private String status;

    public OrderItem() {}

    public OrderItem(Order order, Product products, User user, Integer quantity, Double price, String size) {
        this.order = order;
        this.products = products;
        this.user = user;
        this.quantity = quantity;
        this.price = price;
        this.size = size;
    }

    public Long getProductId() {
        return products != null ? products.getId() : null;
    }

    public String getName() {
        return products != null ? products.getName() : "Product (Unavailable)";
    }

    public List<String> getImage() {
        if (products != null && products.getImages() != null && !products.getImages().isEmpty()) {
            return products.getImages().stream().map(ProductImage::getImageUrl).collect(java.util.stream.Collectors.toList());
        }
        return java.util.Collections.emptyList();
    }

    public String getSellerEmail() {
        return products != null ? products.getEmail() : null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderItem)) return false;
        OrderItem other = (OrderItem) o;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }


    public static class Builder {
        private final OrderItem orderItem;

        public Builder() {
            orderItem = new OrderItem();
        }

        public Builder order(Order order) {
            orderItem.setOrder(order);
            return this;
        }

        public Builder product(Product product) {
            orderItem.setProducts(product);
            return this;
        }

        public Builder user(User user) {
            orderItem.setUser(user);
            return this;
        }

        public Builder quantity(Integer quantity) {
            orderItem.setQuantity(quantity);
            return this;
        }

        public Builder price(Double price) {
            orderItem.setPrice(price);
            return this;
        }

        public Builder size(String size) {
            orderItem.setSize(size);
            return this;
        }

        public Builder status(String status) {
            orderItem.setStatus(status);
            return this;
        }

        public OrderItem build() {
            return orderItem;
        }
    }
}
