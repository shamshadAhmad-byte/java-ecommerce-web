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

@Entity 
@Table(name = "addresses")
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

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getStreet() {
        return street;
    }
    public void setStreet(String street) {
        this.street = street;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public String getZipCode() {
        return zipCode;
    }
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public Order getOrder() {
        return order;
    }
    public void setOrder(Order order) {
        this.order = order;
    }

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
