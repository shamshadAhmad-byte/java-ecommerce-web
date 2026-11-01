package com.example.java_ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.java_ecommerce.entity.Address;
import com.example.java_ecommerce.entity.OrderItem;

public class OrderResDto {
    private boolean success;
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private List<Long> productId;
    private List<OrderItem> items;
    private Double totalAmount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String stripeSessionId;
    private String sessionUrl;
    private Address shippingAddress;
    private LocalDateTime createdAt;
    private String message;

    public OrderResDto() {}

    public boolean isSuccess() {
        return success;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Long getId() {
        return id;
    }
    public Long get_id() {
        return id;
    }
    public Long getOrderId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    public String getCustomerEmail() {
        return customerEmail;
    }
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    public String getCustomerPhone() {
        return customerPhone;
    }
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
    public List<Long> getProductId() {
        return productId;
    }
    public void setProductId(List<Long> productId) {
        this.productId = productId;
    }
    public List<OrderItem> getItems() {
        return items;
    }
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
    public Double getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    public String getPaymentStatus() {
        return paymentStatus;
    }
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    public String getStripeSessionId() {
        return stripeSessionId;
    }
    public void setStripeSessionId(String stripeSessionId) {
        this.stripeSessionId = stripeSessionId;
    }
    public String getSessionUrl() {
        return sessionUrl;
    }
    public String getCheckoutUrl() {
        return sessionUrl;
    }
    public void setSessionUrl(String sessionUrl) {
        this.sessionUrl = sessionUrl;
    }
    public Address getShippingAddress() {
        return shippingAddress;
    }
    public Address getAddress() {
        return shippingAddress;
    }
    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
    public boolean isPayment() {
        return "COMPLETED".equalsIgnoreCase(paymentStatus) || "PAID".equalsIgnoreCase(paymentStatus);
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public static class Builder {
        private final OrderResDto orderResDto;

        public Builder() {
            orderResDto = new OrderResDto();
        }

        public Builder withSuccess(boolean success) {
            orderResDto.success = success;
            return this;
        }

        public Builder withId(Long id) {
            orderResDto.id = id;
            return this;
        }

        public Builder withCustomerName(String customerName) {
            orderResDto.customerName = customerName;
            return this;
        }

        public Builder withCustomerEmail(String customerEmail) {
            orderResDto.customerEmail = customerEmail;
            return this;
        }

        public Builder withCustomerPhone(String customerPhone) {
            orderResDto.customerPhone = customerPhone;
            return this;
        }

        public Builder withProductId(List<Long> productId) {
            orderResDto.productId = productId;
            return this;
        }

        public Builder withItems(List<OrderItem> items) {
            orderResDto.items = items;
            return this;
        }

        public Builder withTotalAmount(Double totalAmount) {
            orderResDto.totalAmount = totalAmount;
            return this;
        }

        public Builder withStatus(String status) {
            orderResDto.status = status;
            return this;
        }

        public Builder withPaymentMethod(String paymentMethod) {
            orderResDto.paymentMethod = paymentMethod;
            return this;
        }

        public Builder withPaymentStatus(String paymentStatus) {
            orderResDto.paymentStatus = paymentStatus;
            return this;
        }

        public Builder withStripeSessionId(String stripeSessionId) {
            orderResDto.stripeSessionId = stripeSessionId;
            return this;
        }

        public Builder withSessionUrl(String sessionUrl) {
            orderResDto.sessionUrl = sessionUrl;
            return this;
        }

        public Builder withShippingAddress(Address shippingAddress) {
            orderResDto.shippingAddress = shippingAddress;
            return this;
        }

        public Builder withCreatedAt(LocalDateTime createdAt) {
            orderResDto.createdAt = createdAt;
            return this;
        }
        public Builder withMessage(String message) {
            orderResDto.message = message;
            return this;
        }
        public OrderResDto build() {
            return orderResDto;
        }
    }
}
