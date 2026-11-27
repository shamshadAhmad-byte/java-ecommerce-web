package com.example.java_ecommerce.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter 
@Setter 
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Address shippingAddress;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    private Double totalAmount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String stripeSessionId;
    @jakarta.persistence.Transient
    private String successUrl;
    @jakarta.persistence.Transient
    private String cancelUrl;
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String itemsJson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Order() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
        if (shippingAddress != null) {
            shippingAddress.setOrder(this);
        }
    }

    public void setItems(List<OrderItem> items) {
        this.items.clear();
        if (items != null) {
            for (OrderItem item : items) {
                addItem(item);
            }
        }
    }

    public void addItem(OrderItem item) {
        if (item != null) {
            items.add(item);
            item.setOrder(this);
        }
    }

    public void removeItem(OrderItem item) {
        if (item != null) {
            items.remove(item);
            item.setOrder(null);
        }
    }

    public static class Builder {

        Order order;

        public Builder() {
            order = new Order();
        }

        public Builder customerName(String customerName) {
            order.customerName = customerName;
            return this;
        }

        public Builder customerEmail(String customerEmail) {
            order.customerEmail = customerEmail;
            return this;
        }

        public Builder customerPhone(String customerPhone) {
            order.customerPhone = customerPhone;
            return this;
        }

        public Builder items(List<OrderItem> items) {
            order.setItems(items);
            return this;
        }

        public Builder addItem(OrderItem item) {
            order.addItem(item);
            return this;
        }

        public Builder shippingAddress(Address shippingAddress) {
            order.setShippingAddress(shippingAddress);
            return this;
        }

        public Builder totalAmount(Double totalAmount) {
            order.totalAmount = totalAmount;
            return this;
        }

        public Builder status(String status) {
            order.status = status;
            return this;
        }

        public Builder paymentMethod(String paymentMethod) {
            order.paymentMethod = paymentMethod;
            return this;
        }

        public Builder paymentStatus(String paymentStatus) {
            order.paymentStatus = paymentStatus;
            return this;
        }

        public Builder stripeSessionId(String stripeSessionId) {
            order.stripeSessionId = stripeSessionId;
            return this;
        }

        public Order build() {
            return order;
        }
    }
}
