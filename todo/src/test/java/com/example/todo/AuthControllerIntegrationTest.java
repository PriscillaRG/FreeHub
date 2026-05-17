package com.example.todo;

import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

// tests d'integration de la route POST /api/auth/login
// TestRestTemplate envoie de vraies requetes HTTP (comme Postman mais en code)
// le profil "test" utilise H2 a la place de PostgreSQL
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    // TestRestTemplate = notre "client HTTP" pour les tests
    // il envoie des vraies requetes sur le serveur de test
    @Autowired
    private TestRestTemplate restTemplate;

    // on mocke le repository pour pas toucher a la vraie base de donnees
    @MockBean
    private UserRepository userRepository;

    // on utilise le vrai encodeur BCrypt (comme en production)
    @Autowired
    private PasswordEncoder passwordEncoder;

    private User userEnBase;

    @BeforeEach
    void setUp() {
        // preparation : un utilisateur avec son mot de passe hache
        userEnBase = new User();
        userEnBase.setUsername("priscilla");
        userEnBase.setPassword(passwordEncoder.encode("monmotdepasse"));
        userEnBase.setRole("USER");
    }

    // --- TEST 1 ---
    // bons identifiants → le serveur repond 200 avec le token JWT
    @Test
    void testLogin_avecBonsIdentifiants_retourne200() {
        // on configure le mock pour qu'il retourne notre utilisateur
        when(userRepository.findByUsername("priscilla"))
            .thenReturn(Optional.of(userEnBase));

        // on envoie la requete POST (comme si on faisait fetch() en JS)
        ResponseEntity<String> reponse = restTemplate.postForEntity(
            "/api/auth/login",
            Map.of("username", "priscilla", "password", "monmotdepasse"),
            String.class
        );

        // verification : statut 200 et token present dans la reponse
        assertEquals(HttpStatus.OK, reponse.getStatusCode());
        assertNotNull(reponse.getBody());
    }

    // --- TEST 2 ---
    // mauvais mot de passe → le serveur repond 400 Bad Request
    @Test
    void testLogin_avecMauvaisMotDePasse_retourne400() {
        when(userRepository.findByUsername("priscilla"))
            .thenReturn(Optional.of(userEnBase));

        ResponseEntity<String> reponse = restTemplate.postForEntity(
            "/api/auth/login",
            Map.of("username", "priscilla", "password", "mauvaismdp"),
            String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, reponse.getStatusCode());
    }

    // --- TEST 3 ---
    // utilisateur inexistant → le serveur repond 400 Bad Request
    @Test
    void testLogin_utilisateurInexistant_retourne400() {
        // le repository ne trouve personne avec ce nom
        when(userRepository.findByUsername("inconnu"))
            .thenReturn(Optional.empty());

        ResponseEntity<String> reponse = restTemplate.postForEntity(
            "/api/auth/login",
            Map.of("username", "inconnu", "password", "nimporte"),
            String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, reponse.getStatusCode());
    }
}
