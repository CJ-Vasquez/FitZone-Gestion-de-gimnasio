package com.fitzone.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

public class AttendanceDTOs {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class RegistroEntradaRequest {
        @NotNull(message = "El ID del miembro es obligatorio")
        private Long miembroId;
        private String observacion;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ActualizarAsistenciaRequest {
        private LocalDateTime entrada;
        private LocalDateTime salida;
        private String observacion;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AsistenciaRespuesta {
        private Long id;
        private Long miembroId;
        private LocalDateTime entrada;
        private LocalDateTime salida;
        private String observacion;
        private Long minutosEnLocal;
    }
}
