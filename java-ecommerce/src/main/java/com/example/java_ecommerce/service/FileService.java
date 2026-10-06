package com.example.java_ecommerce.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.java_ecommerce.entity.Product;
import com.example.java_ecommerce.entity.ProductImage;
import com.example.java_ecommerce.exception.FileException;
import com.example.java_ecommerce.repository.ProductImageRepository;

@Service
public class FileService {

    private final Cloudinary cloudinary;
    private final ProductImageRepository productImageRepository;

    public FileService(Cloudinary cloudinary, ProductImageRepository productImageRepository) {
        this.cloudinary = cloudinary;
        this.productImageRepository = productImageRepository;
    }

    public List<ProductImage> uploadFiles(MultipartFile[] files, Product product) {
        if (files == null || files.length == 0) {
            throw new FileException("No files to upload");
        }
        List<ProductImage> uploadedFiles = new ArrayList<>();
        for (MultipartFile file : files) {
            validFile(file);
            ProductImage productImage = uploadSingleFile(file, product);
            System.out.println("Uploaded file: " + productImage.getImageUrl());
            uploadedFiles.add(productImage);
        }
        return uploadedFiles;
    }

    private ProductImage uploadSingleFile(MultipartFile file, Product product) {
        try {
            String publicId = "products-java/" + UUID.randomUUID().toString();
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "products",
                    "public_id",
                    publicId,
                    "resource_type",
                    "auto"
            ));
            ProductImage productImage = new ProductImage();
            productImage.setImageUrl((String) uploadResult.get("secure_url"));
            productImage.setPublicId((String) uploadResult.get("public_id"));
            productImage.setProduct(product);
            productImage = productImageRepository.save(productImage);
            return productImage;
        } catch (IOException e) {
            throw new FileException("Failed to upload file: " + e.getMessage());
        }
    }

    public List<ProductImage> getAllFiles() {
        return productImageRepository.findAll();
    }

    public void deleteFile(Long id) {
        ProductImage file = productImageRepository.findById(id).orElseThrow(()
                -> new FileException("File not found with id: " + id)
        );
        System.out.println("Deleting file: " + file.getImageUrl());
        try {

            cloudinary.uploader().destroy(
                    file.getPublicId(),
                    ObjectUtils.asMap(
                            "resource_type",
                            "image",
                            "invalidate",
                            true
                    )
            );

        } catch (Exception e) {

            throw new FileException(
                    "Failed to delete file from Cloudinary",
                    e
            );
        }
    }

    private void validFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {

            throw new FileException(
                    "File cannot be empty"
            );
        }

        String fileName
                = file.getOriginalFilename();

        if (fileName == null
                || fileName.trim().isEmpty()) {

            throw new FileException(
                    "Invalid file name"
            );
        }

        // Maximum 10 MB
        long maxSize
                = 10 * 1024 * 1024;

        if (file.getSize() > maxSize) {
            throw new FileException(
                    "File size cannot exceed 10 MB"
            );
        }

        // Allowed types
        String contentType
                = file.getContentType();

        List<String> allowedTypes
                = List.of(
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                        "application/pdf"
                );

        if (contentType == null
                || !allowedTypes.contains(contentType)) {

            throw new FileException(
                    "Only JPG, PNG, WEBP and PDF files are allowed"
            );
        }
    }
}
