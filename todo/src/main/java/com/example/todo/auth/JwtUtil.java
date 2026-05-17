package com.example.todo.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // 🔐 Clé secrète (⚠️ à externaliser plus tard dans application.properties ou variable d'environnement)
    private final String SECRET = "monsecretultrasecurepourjwt123456789";
    private final long EXPIRATION_TIME = 86400000; // 1 jour en millisecondes

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // Générer un token avec infos profil
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // surcharge avec email et nom complet
    public String generateToken(String username, String role, String email, String firstName, String lastName, String dateOfBirth) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("email", email != null ? email : "")
                .claim("firstName", firstName != null ? firstName : "")
                .claim("lastName", lastName != null ? lastName : "")
                .claim("dateOfBirth", dateOfBirth != null ? dateOfBirth : "")
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extraire le username
    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey())
                .build().parseClaimsJws(token).getBody().getSubject();
    }

    // Vérifier validité du token
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
