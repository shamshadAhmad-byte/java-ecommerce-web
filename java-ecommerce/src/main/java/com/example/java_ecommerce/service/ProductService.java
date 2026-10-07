package com.example.java_ecommerce.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.java_ecommerce.dto.ProductReqDto;
import com.example.java_ecommerce.dto.ProductResDto;
import com.example.java_ecommerce.entity.Product;
import com.example.java_ecommerce.entity.ProductImage;
import com.example.java_ecommerce.entity.ProductSize;
import com.example.java_ecommerce.entity.User;
import com.example.java_ecommerce.exception.ResourceNotFoundException;
import com.example.java_ecommerce.repository.ProductImageRepository;
import com.example.java_ecommerce.repository.ProductRepository;
import com.example.java_ecommerce.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

import com.example.java_ecommerce.exception.AccessDeniedException;

@Service 
@Transactional
public class ProductService {
    private final ProductRepository productRepository;
    private final FileService fileService;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, FileService fileService, ProductImageRepository productImageRepository, UserRepository userRepository){
        this.productRepository=productRepository;
        this.fileService=fileService;
        this.productImageRepository=productImageRepository;
        this.userRepository=userRepository;
    }

    public ProductResDto createProduct(MultipartFile[] files, ProductReqDto productReqDto,String email){
        Product product=changeProductEntityFromDto(productReqDto);
        product.setEmail(email);
        product=productRepository.save(product);
        List<ProductSize> sizes=storeProductSizes(productReqDto.getSizes(), product);
        product.setSizes(sizes);
        if (files != null && files.length > 0 && !files[0].isEmpty()) {
            List<ProductImage> images=fileService.uploadFiles(files, product);
            product.setImages(images);
        }
        product=productRepository.save(product);
        ProductResDto productResDto=changeProductDtoFromEntity(product);

        return productResDto;
    }
    @Transactional(readOnly = true)
    public ProductResDto getProductById(Long id){
        Product product=productRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Product not found"));
        ProductResDto productResDto=changeProductDtoFromEntity(product);
        return productResDto;
    }
    @Transactional(readOnly = true)
    public List<ProductResDto> getAllProducts(){
        List<Product> products=productRepository.findAll();
        List<ProductResDto> productResDtos=new ArrayList<>();
        for(Product product:products){
            ProductResDto productResDto=changeProductDtoFromEntity(product);
            productResDtos.add(productResDto);
        }
        return productResDtos;
    }
    
    @Transactional(readOnly = true)
    public List<ProductResDto> getAllProductsForAdmin(String email){
        User user = userRepository.findByEmail(email);
        boolean isAdmin = user != null && "ADMIN".equalsIgnoreCase(user.getRole());
        List<Product> products = isAdmin ? productRepository.findAll() : productRepository.findByEmail(email);
        List<ProductResDto> productResDtos=new ArrayList<>();
        for(Product product:products){
            ProductResDto productResDto=changeProductDtoFromEntity(product);
            productResDtos.add(productResDto);
        }
        return productResDtos;
    }

    @Transactional(readOnly = true)
    public ProductResDto getProductByIdAndEmail(Long id, String email){
        Product product=productRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Product not found"));
        User user = userRepository.findByEmail(email);
        boolean isAdmin = user != null && "ADMIN".equalsIgnoreCase(user.getRole());
        if (!isAdmin && !product.getEmail().equals(email)) {
            throw new AccessDeniedException("You are not the owner of this product");
        }
        ProductResDto productResDto=changeProductDtoFromEntity(product);
        return productResDto;
    }

    public ProductResDto updateProduct(Long id, ProductReqDto productReqDto, String email){
        Product product=productRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Product not found"));
        User user = userRepository.findByEmail(email);
        boolean isAdmin = user != null && "ADMIN".equalsIgnoreCase(user.getRole());
        if (!isAdmin && !product.getEmail().equals(email)) {
            throw new AccessDeniedException("You are not the owner of this product");
        }
        product.setName(productReqDto.getName());
        product.setDescription(productReqDto.getDescription());
        product.setPrice(productReqDto.getPrice());
        product.setCategory(productReqDto.getCategory());
        product.setSubCategory(productReqDto.getSubCategory());
        product.setBestSeller(productReqDto.isBestSeller());
        if (productReqDto.getSizes() != null) {
            List<ProductSize> sizes=storeProductSizes(productReqDto.getSizes(), product);
            product.setSizes(sizes);
        }
        product=productRepository.save(product);
        ProductResDto productResDto=changeProductDtoFromEntity(product);
        return productResDto;
    }
    public void deleteProduct(Long id, String email){
        Product product=productRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Product not found"));
        User user = userRepository.findByEmail(email);
        boolean isAdmin = user != null && "ADMIN".equalsIgnoreCase(user.getRole());
        if (!isAdmin && !product.getEmail().equals(email)) {
            throw new AccessDeniedException("You are not the owner of this product");
        }
        List<ProductImage> productImage=productImageRepository.findByProduct(product);
        productImage.stream().forEach((image)->{
            fileService.deleteFile(image.getId());
        });
        productRepository.delete(product);
    }
    private Product changeProductEntityFromDto(ProductReqDto productReqDto){
        Product product=new Product();
        product.setName(productReqDto.getName());
        product.setDescription(productReqDto.getDescription());
        product.setPrice(productReqDto.getPrice());
        product.setCategory(productReqDto.getCategory());
        product.setSubCategory(productReqDto.getSubCategory());
        product.setBestSeller(productReqDto.isBestSeller());
        product.setCreatedAt(productReqDto.getCreatedAt() != null ? productReqDto.getCreatedAt() : java.time.LocalDateTime.now());
        return product;
    }
    private ProductResDto changeProductDtoFromEntity(Product product){
        ProductResDto productResDto=new ProductResDto();
        productResDto.setId(product.getId());
        productResDto.setName(product.getName());
        productResDto.setDescription(product.getDescription());
        productResDto.setPrice(product.getPrice());
        productResDto.setCategory(product.getCategory());
        productResDto.setSubCategory(product.getSubCategory());
        productResDto.setBestSeller(product.isBestSeller());
        productResDto.setSizes(product.getSizes());
        productResDto.setImages(product.getImages());
        productResDto.setCreatedAt(product.getCreatedAt());
        return productResDto;
    }
    private List<ProductSize> storeProductSizes(List<ProductSize> sizes, Product product){
        List<ProductSize> storedSizes=new ArrayList<>();
        if (sizes == null) {
            return storedSizes;
        }
        for(ProductSize size:sizes){
            ProductSize productSize =new ProductSize();
            productSize.setSize(size.getSize());
            productSize.setProduct(product);
            storedSizes.add(productSize);
        }
        return storedSizes;
    }
}
