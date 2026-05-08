package com.grupocordillera.kpi.controller;

import com.grupocordillera.kpi.dto.AuthRequest;
import com.grupocordillera.kpi.dto.AuthResponse;
import com.grupocordillera.kpi.dto.ResetPasswordRequest;
import com.grupocordillera.kpi.model.Usuario;
import com.grupocordillera.kpi.repository.UsuarioRepository;
import com.grupocordillera.kpi.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody AuthRequest request) {

        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El usuario ya existe");
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

        return ResponseEntity.ok("Usuario registrado correctamente");
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
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Contraseña actualizada correctamente");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {

        Map<String, Object> response = new HashMap<>();

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            response.put("valid", false);
            response.put("message", "Token no enviado");
            return ResponseEntity.status(401).body(response);
        }

        String token = authorizationHeader.substring(7);
        boolean valid = jwtUtil.validateToken(token);

        if (!valid) {
            response.put("valid", false);
            response.put("message", "Token inválido o expirado");
            return ResponseEntity.status(401).body(response);
        }

        response.put("valid", true);
        response.put("username", jwtUtil.extractUsername(token));

        return ResponseEntity.ok(response);
    }
}