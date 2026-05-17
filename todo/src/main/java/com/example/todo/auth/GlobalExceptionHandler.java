package com.example.todo.auth;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // violation de contrainte unique (username ou email deja utilise)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDuplicate(DataIntegrityViolationException ex) {
        String msg = "Ce nom d'utilisateur ou cet email est deja utilise.";
        // on essaie de preciser selon le champ en cause
        String detail = ex.getMostSpecificCause().getMessage();
        if (detail != null && detail.contains("email")) {
            msg = "Cet email est deja associe a un compte.";
        } else if (detail != null && detail.contains("username")) {
            msg = "Ce nom d'utilisateur est deja pris.";
        }
        return ResponseEntity.badRequest().body(Map.of("message", msg));
    }

    // toutes les autres exceptions non gerees
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }
}
