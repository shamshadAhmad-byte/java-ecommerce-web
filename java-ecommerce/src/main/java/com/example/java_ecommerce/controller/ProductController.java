package com.example.java_ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "image", required = false) MultipartFile[] imageFiles,
            Authentication authentication
    ) throws Exception {
        MultipartFile[] uploadFiles = (files != null && files.length > 0) ? files : imageFiles;
        ProductReqDto productReqDto
                = objectMapper.readValue(productJson, ProductReqDto.class);
        ProductResDto productResDto = productService.createProduct(uploadFiles, productReqDto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(productResDto);
    }

    @GetMapping
    public ResponseEntity<ProductResponse> getAllProducts() {
        return ResponseEntity.status(HttpStatus.OK).body(new ProductResponse(true, productService.getAllProducts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.getProductById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResDto> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductReqDto productReqDto,
            Authentication authentication
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, productReqDto, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProductResponse> deleteProduct(@PathVariable Long id, Authentication authentication) {
        productService.deleteProduct(id, authentication.getName());
        return ResponseEntity.status(HttpStatus.OK).body(new ProductResponse(true, "Product deleted successfully"));
    }

    @GetMapping("/admin")
    public ResponseEntity<ProductResponse> getAllProductsForAdmin(Authentication authentication) {
        List<ProductResDto> products = productService.getAllProductsForAdmin(authentication.getName());
        return ResponseEntity.status(HttpStatus.OK).body(new ProductResponse(true, products));
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<ProductResDto> getProductByIdAndEmail(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.getProductByIdAndEmail(id, authentication.getName()));
    }

    private class ProductResponse{
        private boolean success;
        private List<ProductResDto> products;
        private String message;
        public ProductResponse(boolean success, List<ProductResDto> products){
            this.success=success;
            this.products=products;
        }
        public ProductResponse(boolean success, String message){
            this.success=success;
            this.message=message;
        }
        public String getMessage() {
            return message;
        }
        public boolean isSuccess() {
            return success;
        }
        public List<ProductResDto> getProducts() {
            return products;
        }
    }
}
