package com.example.java_ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.java_ecommerce.entity.Order;

@Repository 
public interface OrderRepository extends JpaRepository<Order, Long>{
    List<Order> findByCustomerEmail(String customerEmail);

    Optional<Order> findByStripeSessionId(String stripeSessionId);
}
