package com.example.java_ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class CartResDto {
    private Long id;
    private Long quantity;
    private String size;
    private Integer price;
    private String name;
    private Long productId;

    public CartResDto() {
    }
    public static class Builder {

        private final CartResDto cartResDto;

        public Builder() {
            cartResDto = new CartResDto();
        }
        public Builder withId(Long id) {
            cartResDto.id = id;
            return this;
        }
        public Builder withQuantity(Long quantity) {
            cartResDto.quantity = quantity;
            return this;
        }

        public Builder withSize(String size) {
            cartResDto.size = size;
            return this;
        }
        public Builder withPrice(Integer price) {
            cartResDto.price = price;
            return this;
        }
        public Builder withName(String name) {
            cartResDto.name = name;
            return this;
        }
        public Builder withProductId(Long productId) {
            cartResDto.productId = productId;
            return this;
        }

        public CartResDto build() {
            return cartResDto;
        }
    }
}