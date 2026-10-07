package com.example.java_ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.java_ecommerce.entity.Order;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository 
public interface OrderRepository extends JpaRepository<Order, Long>{
    List<Order> findByCustomerEmail(String customerEmail);
    Optional<Order> findByStripeSessionId(String stripeSessionId);

    @Query("""
    SELECT DISTINCT o
    FROM Order o
    JOIN o.items oi
    JOIN oi.products p
    WHERE LOWER(p.email) = LOWER(:email)
    ORDER BY o.id DESC
    """)
    List<Order> findOrdersBySellerEmail(@Param("email") String email);

    @Query("SELECT o FROM Order o ORDER BY o.id DESC")
    List<Order> findAllOrdersDesc();
}
