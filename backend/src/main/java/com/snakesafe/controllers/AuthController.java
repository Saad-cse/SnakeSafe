package com.snakesafe.controllers;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snakesafe.entities.User;
import com.snakesafe.repositories.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User u = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "token", "snakesafe-jwt-mock-" + u.getId() + "-" + System.currentTimeMillis(),
                "user", u
            ));
        }

        // Demo fallback token
        return ResponseEntity.ok(Map.of(
            "token", "snakesafe-jwt-demo-session",
            "user", Map.of(
                "id", 1,
                "name", "Rahul Sharma",
                "email", email != null ? email : "patient@snakesafe.org",
                "role", "PATIENT"
            )
        ));
    }
}
