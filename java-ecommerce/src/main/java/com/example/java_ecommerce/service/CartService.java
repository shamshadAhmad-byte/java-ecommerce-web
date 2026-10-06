package com.example.java_ecommerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.java_ecommerce.dto.CartReqDto;
import com.example.java_ecommerce.dto.CartResDto;
import com.example.java_ecommerce.entity.Cart;
import com.example.java_ecommerce.entity.Product;
import com.example.java_ecommerce.entity.User;
import com.example.java_ecommerce.exception.ResourceNotFoundException;
import com.example.java_ecommerce.repository.CartRepository;
import java.util.Objects;
import com.example.java_ecommerce.repository.ProductRepository;
import com.example.java_ecommerce.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

@Service 
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public CartResDto createCart(CartReqDto cartReqDto, String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User with email " + email + " not found");
        }
        Product product = productRepository.findById(cartReqDto.getProductId()).orElseThrow(()
                -> new ResourceNotFoundException("Product not found"));

        List<Cart> userCarts = cartRepository.findByUserId(user.getId());
        for (Cart existingCart : userCarts) {
            if (existingCart.getProduct() != null 
                    && existingCart.getProduct().getId().equals(product.getId())
                    && Objects.equals(existingCart.getSize(), cartReqDto.getSize())) {
                long currentQty = existingCart.getQuantity() != null ? existingCart.getQuantity() : 0L;
                long addQty = cartReqDto.getQuantity() != null ? cartReqDto.getQuantity() : 1L;
                existingCart.setQuantity(currentQty + addQty);
                Cart saved = cartRepository.save(existingCart);
                return changeEntityCartToCartResDto(saved);
            }
        }

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setSize(cartReqDto.getSize());
        cart.setQuantity(cartReqDto.getQuantity() != null ? cartReqDto.getQuantity() : 1L);
        cart.setProduct(product);
        Cart savedCart = cartRepository.save(cart);
        return changeEntityCartToCartResDto(savedCart);
    }

    @Transactional(readOnly = true)
    public CartResDto getCartById(Long cartId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return changeEntityCartToCartResDto(cart);
    }

    @Transactional(readOnly = true)
    public List<CartResDto> getAllCarts(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User with email " + email + " not found");
        }
        List<Cart> carts = cartRepository.findByUserId(user.getId());
        return carts.stream().map(this::changeEntityCartToCartResDto)
                .collect(Collectors.toList());
    }

    public CartResDto updateCart(Long cartId, CartReqDto cartReqDto) {
        Cart existingCart = cartRepository.findById(cartId).orElseThrow(()
                -> new ResourceNotFoundException("Cart not found"));
        if (cartReqDto.getQuantity() != null) {
            existingCart.setQuantity(cartReqDto.getQuantity());
        }
        if (cartReqDto.getSize() != null && !cartReqDto.getSize().isBlank()) {
            existingCart.setSize(cartReqDto.getSize());
        }
        Cart updatedCart = cartRepository.save(existingCart);
        return changeEntityCartToCartResDto(updatedCart);
    }

    public void deleteCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cartRepository.delete(cart);
    }

    private Cart changeCartReqDtoToEntityCart(CartReqDto cartReqDto, String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User with email " + email + " not found");
        }
        Product product = productRepository.findById(cartReqDto.getProductId()).orElseThrow(()
                -> new ResourceNotFoundException("Product not found"));
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setSize(cartReqDto.getSize());
        cart.setQuantity(cartReqDto.getQuantity());
        cart.setProduct(product);
        return cart;
    }

    private CartResDto changeEntityCartToCartResDto(Cart cart) {
        CartResDto cartResDto = new CartResDto.Builder()
                .withId(cart.getId())
                .withQuantity(cart.getQuantity())
                .withSize(cart.getSize())
                .withPrice(cart.getProduct().getPrice())
                .withName(cart.getProduct().getName())
                .withProductId(cart.getProduct().getId())
                .build();
        return cartResDto;
    }
}
