package com.example.java_ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.java_ecommerce.entity.Address;
import com.example.java_ecommerce.entity.OrderItem;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
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
    public boolean isPayment() {
        return "COMPLETED".equalsIgnoreCase(paymentStatus) || "PAID".equalsIgnoreCase(paymentStatus);
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
