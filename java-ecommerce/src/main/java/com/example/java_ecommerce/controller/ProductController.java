package com.example.java_ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.java_ecommerce.dto.ProductReqDto;
import com.example.java_ecommerce.dto.ProductResDto;
import com.example.java_ecommerce.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final ObjectMapper objectMapper;

    public ProductController(ProductService productService, ObjectMapper objectMapper) {
        this.productService = productService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResDto> createProduct(
            @RequestPart(value = "product") String productJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files
    ) throws Exception {
        ProductReqDto productReqDto
                = objectMapper.readValue(productJson, ProductReqDto.class);
        ProductResDto productResDto = productService.createProduct(files, productReqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productResDto);
    }

    @GetMapping
    public ResponseEntity<List<ProductResDto>> getAllProducts() {
        return ResponseEntity.status(HttpStatus.OK).body(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.getProductById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResDto> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductReqDto productReqDto
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, productReqDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
