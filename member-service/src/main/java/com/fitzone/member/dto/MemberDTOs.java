package com.fitzone.member.dto;

import com.fitzone.member.entity.Member;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public class MemberDTOs {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CrearMiembroRequest {
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100)
        private String nombre;

        @NotBlank(message = "El apellido es obligatorio")
        @Size(max = 100)
        private String apellido;

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Email inválido")
        private String email;

        @Size(max = 15)
        private String telefono;

        @NotBlank(message = "El DNI es obligatorio")
        @Size(min = 8, max = 8, message = "El DNI debe tener 8 caracteres")
        private String dni;

        private Long planId;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ActualizarMiembroRequest {
        @Size(max = 100)
        private String nombre;

        @Size(max = 100)
        private String apellido;

        @Email
        private String email;

        @Size(max = 15)
        private String telefono;

        private Member.Estado estado;
        private Long planId;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MiembroRespuesta {
        private Long id;
        private String nombre;
        private String apellido;
        private String email;
        private String telefono;
        private String dni;
        private String estado;
        private Long planId;
        private LocalDateTime fechaRegistro;
        private LocalDateTime fechaActualizacion;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class EventoPago {
        private Long miembroId;
        private Long planId;
        private String tipoEvento;
    }
}
