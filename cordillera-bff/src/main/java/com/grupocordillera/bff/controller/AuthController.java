package com.grupocordillera.bff.controller;

import com.grupocordillera.bff.client.AuthClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthClient authClient;

    public AuthController(AuthClient authClient) {
        this.authClient = authClient;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Object request) {
        return authClient.login(request);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Object request) {
        return authClient.register(request);
    }

    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Object request) {
        return authClient.resetPassword(request);
    }

    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authorization) {
        return authClient.validateToken(authorization);
    }
}