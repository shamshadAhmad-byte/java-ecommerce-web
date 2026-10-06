package com.example.java_ecommerce.filter;

import java.io.IOException;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
@Order(1)
public class LogFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        long startTime = System.currentTimeMillis();
        System.out.println("========== Incoming Request ==========");
        System.out.println("Method : " + httpRequest.getMethod());
        System.out.println("URI : " + httpRequest.getRequestURI());
        System.out.println("Headers : " + java.util.Collections.list(httpRequest.getHeaderNames()));
        try { // Continue request 
            chain.doFilter(request, response);
        } finally {
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            System.out.println("========== Outgoing Response ==========");
            System.out.println("Duration : " + executionTime + " ms");
        }
    }

}
