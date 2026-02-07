package com.cargorent.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

        @Value("${jwt.secret}")
        private String secret;

        @Value("${jwt.access-token-expiry-ms}")
        private Long accessTokenExpiry;

        @Value("${jwt.refresh-token-expiry-ms}")
        private Long refreshTokenExpiry;

        private SecretKey getSigningKey() {
                return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }

        public String generateAccessToken(Long userId, String role) {
                return Jwts.builder()
                                .setSubject(String.valueOf(userId))
                                .claim("role", role)
                                .claim("type", "ACCESS")
                                .setIssuedAt(new Date())
                                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiry))
                                .signWith(getSigningKey())
                                .compact();
        }

        public String generateRefreshToken(Long userId) {
                return Jwts.builder()
                                .setSubject(String.valueOf(userId))
                                .claim("type", "REFRESH")
                                .setIssuedAt(new Date())
                                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiry))
                                .signWith(getSigningKey())
                                .compact();
        }

        public Claims extractClaims(String token) {
                return Jwts.parserBuilder()
                                .setSigningKey(getSigningKey())
                                .build()
                                .parseClaimsJws(token)
                                .getBody();
        }

        public boolean isTokenExpired(String token) {
                try {
                        return extractClaims(token).getExpiration().before(new Date());
                } catch (Exception e) {
                        return true;
                }
        }
}