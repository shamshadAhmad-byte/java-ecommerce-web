package com.example.java_ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.java_ecommerce.entity.Address;
@Repository 
public interface AddressRepository extends JpaRepository<Address, Long>{
    
}
