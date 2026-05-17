package com.example.todo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

// verifie que le contexte Spring Boot se charge correctement
// profil "test" = H2 en memoire, pas besoin de PostgreSQL
@SpringBootTest
@ActiveProfiles("test")
class DemoApplicationTests {

	@Test
	void contextLoads() {
		// si ce test passe, toute la config Spring est valide
	}

}
