package com.example.java_ecommerce.filter;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Component 
public class RateLimiter extends OncePerRequestFilter{

    public static final int MAX_REQUESTS = 100; // Maximum requests allowed
    public static final long TIME_WINDOW = 60 * 1000; // Time window in milliseconds (1 minute)
    public final Map<String, RateLimitInfo> clients = new ConcurrentHashMap<>(); // Store request counts per IP

    @Override 
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        // Implement rate limiting logic here

        String clientIp= request.getRemoteAddr();
        long currentTime = System.currentTimeMillis();

        RateLimitInfo info = clients.compute(clientIp, (key, old)->{
            if(old==null || currentTime - old.windowStart > TIME_WINDOW){
                return new RateLimitInfo(currentTime, 1);
            } else{
                old.requestCount++;
                return old;
            }
        });

        if(info.requestCount > MAX_REQUESTS){
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too Many Requests\", \"message\": \"You have exceeded the maximum number of requests per minute.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    public static class RateLimitInfo{
        long windowStart;
        int requestCount;
        public RateLimitInfo(long windowStart, int requestCount){
            this.windowStart = windowStart;
            this.requestCount = requestCount;
        }
    }

}
