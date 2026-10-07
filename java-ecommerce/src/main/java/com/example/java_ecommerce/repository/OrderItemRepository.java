package com.example.java_ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.java_ecommerce.entity.OrderItem;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
    SELECT oi
    FROM OrderItem oi
    JOIN oi.products p
    WHERE LOWER(p.email) = LOWER(:email)
    """)
    List<OrderItem> findSellerOrderItems(
            @Param("email") String email
    );

    List<OrderItem> findByOrderId(Long orderId);
}
