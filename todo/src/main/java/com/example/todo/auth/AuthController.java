package com.example.todo.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "https://spontaneous-ganache-966b5a.netlify.app"}) // autoriser Angular local
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // Inscription d'un nouvel utilisateur
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.save(user);
    }

    // Connexion (renvoie JWT avec infos profil)
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User existing = userService.findByUsername(user.getUsername());
        if (existing != null && userService.checkPassword(user.getPassword(), existing.getPassword())) {
            return jwtUtil.generateToken(
                existing.getUsername(),
                existing.getRole(),
                existing.getEmail(),
                existing.getFirstName(),
                existing.getLastName(),
                existing.getDateOfBirth()
            );
        }
        throw new RuntimeException("Identifiants invalides");
    }

    // changement de mot de passe
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> body,
                                                  Authentication authentication) {
        String oldPwd = body.get("oldPassword");
        String newPwd = body.get("newPassword");
        if (oldPwd == null || newPwd == null || newPwd.length() < 6) {
            return ResponseEntity.badRequest().body("Mot de passe invalide");
        }
        boolean ok = userService.changePassword(authentication.getName(), oldPwd, newPwd);
        if (!ok) return ResponseEntity.status(401).body("Ancien mot de passe incorrect");
        return ResponseEntity.ok("Mot de passe mis a jour");
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.findAll();
    }
}
