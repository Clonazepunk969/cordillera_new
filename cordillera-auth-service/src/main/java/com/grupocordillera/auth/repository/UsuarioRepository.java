package com.grupocordillera.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grupocordillera.auth.model.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
}