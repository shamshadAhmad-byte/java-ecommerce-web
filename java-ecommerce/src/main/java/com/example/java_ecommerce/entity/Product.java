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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter 
@Setter 
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Product description is required")
    private String description;

    @NotNull(message = "Product price is required")
    @PositiveOrZero(message = "Product price must be positive or zero")
    private Integer price;

    @NotBlank(message = "Product category is required")
    private String category;

    @NotBlank(message = "Product sub category is required")
    private String subCategory;

    private boolean bestSeller = false;

    private LocalDateTime createdAt;
    private String email;

    @OneToMany(
        mappedBy = "product",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(
        mappedBy = "product",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<ProductSize> sizes = new ArrayList<>();

    public Product() {
    }


    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // IMPORTANT: Don't replace the Hibernate-managed collection
    public void setImages(List<ProductImage> images) {
        this.images.clear();

        if (images != null) {
            for (ProductImage image : images) {
                image.setProduct(this);
                this.images.add(image);
            }
        }
    }

    // IMPORTANT: Don't replace the Hibernate-managed collection
    public void setSizes(List<ProductSize> sizes) {
        this.sizes.clear();

        if (sizes != null) {
            for (ProductSize size : sizes) {
                size.setProduct(this);
                this.sizes.add(size);
            }
        }
    }

    // Helper methods
    public void addSize(ProductSize size) {
        sizes.add(size);
        size.setProduct(this);
    }

    public void removeSize(ProductSize size) {
        sizes.remove(size);
        size.setProduct(null);
    }

    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }

    public void removeImage(ProductImage image) {
        images.remove(image);
        image.setProduct(null);
    }
}