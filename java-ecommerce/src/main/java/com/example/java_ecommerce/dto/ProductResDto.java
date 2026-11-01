package com.example.java_ecommerce.dto;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

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
    private boolean success = true;

    public ProductResDto() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Integer getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public String getSubCategory() {
        return subCategory;
    }

    public boolean isBestSeller() {
        return bestSeller;
    }

    public boolean getBestseller() {
        return bestSeller;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<ProductImage> getImages() {
        if (images == null)
            return Collections.emptyList();
        return images;
    }

    public List<ProductSize> getSizes() {
        if (sizes == null)
            return Collections.emptyList();
        return sizes;
    }

    public boolean getSuccess() {
        return success;
    }

    public static class Builder {
        private final ProductResDto productResDto;

        public Builder() {
            productResDto = new ProductResDto();
        }

        public Builder withSuccess(boolean success) {
            productResDto.success = success;
            return this;
        }

        public Builder withId(Long id) {
            productResDto.id = id;
            return this;
        }

        public Builder withName(String name) {
            productResDto.name = name;
            return this;
        }

        public Builder withDescription(String description) {
            productResDto.description = description;
            return this;
        }

        public Builder withPrice(Integer price) {
            productResDto.price = price;
            return this;
        }

        public Builder withCategory(String category) {
            productResDto.category = category;
            return this;
        }

        public Builder withSubCategory(String subCategory) {
            productResDto.subCategory = subCategory;
            return this;
        }

        public Builder withBestSeller(boolean bestSeller) {
            productResDto.bestSeller = bestSeller;
            return this;
        }

        public Builder withCreatedAt(LocalDateTime createdAt) {
            productResDto.createdAt = createdAt;
            return this;
        }

        public Builder withImages(List<ProductImage> images) {
            productResDto.images = images;
            return this;
        }

        public Builder withSizes(List<ProductSize> sizes) {
            productResDto.sizes = sizes;
            return this;
        }

        public ProductResDto build() {
            return productResDto;
        }
    }
}
