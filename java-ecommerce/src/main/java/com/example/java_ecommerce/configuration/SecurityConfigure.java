package com.example.java_ecommerce.configuration;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.java_ecommerce.filter.JwtAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfigure {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfigure(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration=new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "token"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                // Public endpoints — no auth required
                .requestMatchers("/api/users/signin",
                        "/api/users/signup").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/orders/webhook")
                .permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**")
                .permitAll()
                .requestMatchers(HttpMethod.POST, "/api/products/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/products/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**")
                .hasRole("ADMIN")
                // =========================
                // ADMIN APIs
                // =========================
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")
                // =========================
                // USER APIs
                // =========================
                .requestMatchers("/api/users/**")
                .hasAnyRole("USER", "ADMIN")
                // All other endpoints require authentication
                .anyRequest().authenticated()
                ).addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
