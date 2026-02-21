package com.fitzone.auth.dto;

import com.fitzone.auth.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class AuthDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegistroRequest {
        @NotBlank(message = "El usuario es obligatorio")
        @Size(min = 3, max = 50)
        private String username;

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Formato de email inválido")
        private String email;

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        private String password;

        private User.Rol role = User.Rol.MIEMBRO;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "El usuario es obligatorio")
        private String username;

        @NotBlank(message = "La contraseña es obligatoria")
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthRespuesta {
        private String token;
        private String refreshToken;
        private String username;
        private String email;
        private String role;
        private String message;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioRespuesta {
        private Long id;
        private String username;
        private String email;
        private String role;
        private Boolean habilitado;
        private LocalDateTime fechaCreacion;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActualizarUsuarioRequest {
        @Email(message = "Formato de email inválido")
        private String email;
        private User.Rol role;
        private Boolean habilitado;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefreshRequest {
        @NotBlank
        private String refreshToken;
    }
}
