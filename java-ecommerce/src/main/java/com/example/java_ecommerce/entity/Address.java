package com.example.java_ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity 
@Table(name = "addresses")
@Getter 
@Setter 
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String phone;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    public Address() {}

    public static class Builder {
        Address address;
        public Builder() {
            address = new Address();
        }
        public Builder firstName(String firstName) {
            address.firstName = firstName;
            return this;
        }
        public Builder lastName(String lastName) {
            address.lastName = lastName;
            return this;
        }
        public Builder email(String email) {
            address.email = email;
            return this;
        }
        public Builder street(String street) {
            address.street = street;
            return this;
        }
        public Builder city(String city) {
            address.city = city;
            return this;
        }
        public Builder state(String state) {
            address.state = state;
            return this;
        }
        public Builder zipCode(String zipCode) {
            address.zipCode = zipCode;
            return this;
        }
        public Builder country(String country) {
            address.country = country;
            return this;
        }
        public Builder phone(String phone) {
            address.phone = phone;
            return this;
        }
        public Builder order(Order order) {
            address.order = order;
            return this;
        }
        public Address build() {
            return address;
        }
    }
}
