package com.grupocordillera.auth.controller;

import com.grupocordillera.auth.dto.AuthRequest;
import com.grupocordillera.auth.dto.AuthResponse;
import com.grupocordillera.auth.dto.ResetPasswordRequest;
import com.grupocordillera.auth.model.Usuario;
import com.grupocordillera.auth.repository.UsuarioRepository;
import com.grupocordillera.auth.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UsuarioRepository usuarioRepository,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody AuthRequest request) {

        Map<String, String> response = new HashMap<>();

        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            response.put("message", "El usuario ya existe");
            return ResponseEntity.badRequest().body(response);
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));

        String role = request.getRole();

        if (role == null || role.trim().isEmpty()) {
            role = "ANALISTA";
        }

        usuario.setRole(role.toUpperCase());
        usuarioRepository.save(usuario);

        response.put("message", "Usuario registrado correctamente");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtil.generateToken(usuario.getUsername());

        return ResponseEntity.ok(
                new AuthResponse(token, usuario.getUsername(), usuario.getRole())
        );
    }

    @PutMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Contraseña actualizada correctamente");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Map<String, String>> validateToken(
            @RequestHeader("Authorization") String authHeader
    ) {
        Map<String, String> response = new HashMap<>();

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.put("message", "Token inválido");
            return ResponseEntity.status(401).body(response);
        }

        String token = authHeader.substring(7);

        if (jwtUtil.validateToken(token)) {
            response.put("message", "Token válido");
            return ResponseEntity.ok(response);
        }

        response.put("message", "Token inválido");
        return ResponseEntity.status(401).body(response);
    }
}