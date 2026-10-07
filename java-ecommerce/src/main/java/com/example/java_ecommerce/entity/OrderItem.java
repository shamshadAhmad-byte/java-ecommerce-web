package com.example.java_ecommerce.entity;

import java.util.ArrayList;
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

@Entity 
@Table(name = "order_items")
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

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Order getOrder() {
        return order;
    }
    public void setOrder(Order order) {
        this.order = order;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }
    public String getSize() {
        return size;
    }
    public void setSize(String size) {
        this.size = size;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public Long get_id() {
        return id;
    }

    public Long getItemId() {
        return id;
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

    public Product getProducts() {
        return products;
    }

    public void setProducts(Product products) {
        this.products = products;
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
