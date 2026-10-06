package com.example.java_ecommerce.filter;

import java.io.IOException;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.java_ecommerce.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {

        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }
        String token = authorizationHeader.substring(7);
        try {

            if (!jwtService.isTokenValid(token)) {
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Token is invalid\"}");
                return;
            }
            String email = jwtService.extractEmail(token);
            String rawRole = jwtService.extractRole(token);
            String role = rawRole != null ? rawRole.trim().toUpperCase() : "";
            if (role.startsWith("ROLE_")) {
                role = role.substring(5);
            }
            // Convert USER -> ROLE_USER, ADMIN -> ROLE_ADMIN
            if (!"USER".equals(role) && !"ADMIN".equals(role)) {
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"error\":\"Forbidden\",\"message\":\"Invalid role\"}"
                );
                return;
            }
            var authority= new SimpleGrantedAuthority("ROLE_" + role);
            Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, List.of(authority));
            request.setAttribute("authentication", authentication);
            // Store authentication
            SecurityContextHolder
                    .getContext()
                    .setAuthentication((@Nullable Authentication) authentication);

        } catch (Exception e) {
            // Invalid JWT — stop the filter chain and return 401 immediately
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid JWT token\"}");
            return;
        }
        chain.doFilter(request, response);
    }
}
