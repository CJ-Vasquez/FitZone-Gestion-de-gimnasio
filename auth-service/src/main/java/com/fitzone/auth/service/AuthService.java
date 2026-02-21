package com.fitzone.auth.service;

import com.fitzone.auth.dto.AuthDTOs.*;
import com.fitzone.auth.entity.User;
import com.fitzone.auth.repository.UserRepository;
import com.fitzone.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthRespuesta register(RegistroRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El usuario ya existe");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(request.getRole() != null ? request.getRole() : User.Rol.MIEMBRO)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthRespuesta.builder()
                .token(token)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRol().name())
                .message("Usuario registrado exitosamente")
                .build();
    }

    public AuthRespuesta login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthRespuesta.builder()
                .token(token)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRol().name())
                .message("Inicio de sesión exitoso")
                .build();
    }

    public AuthRespuesta refresh(RefreshRequest request) {
        String username = jwtUtil.extractUsername(request.getRefreshToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String newToken = jwtUtil.generateToken(user);
        String newRefreshToken = jwtUtil.generateRefreshToken(user);

        return AuthRespuesta.builder()
                .token(newToken)
                .refreshToken(newRefreshToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRol().name())
                .message("Token actualizado")
                .build();
    }

    public List<UsuarioRespuesta> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUsuarioRespuesta)
                .collect(Collectors.toList());
    }

    public UsuarioRespuesta getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        return mapToUsuarioRespuesta(user);
    }

    public UsuarioRespuesta updateUser(Long id, ActualizarUsuarioRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getRole() != null) user.setRol(request.getRole());
        if (request.getHabilitado() != null) user.setHabilitado(request.getHabilitado());

        userRepository.save(user);
        return mapToUsuarioRespuesta(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UsuarioRespuesta mapToUsuarioRespuesta(User user) {
        return UsuarioRespuesta.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRol().name())
                .habilitado(user.getHabilitado())
                .fechaCreacion(user.getFechaCreacion())
                .build();
    }
}
