package com.fitzone.plan.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PlanDTOs {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CrearPlanRequest {
        @NotBlank(message = "El nombre del plan es obligatorio")
        @Size(max = 100)
        private String nombre;

        @Size(max = 500)
        private String descripcion;

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser positivo")
        private BigDecimal precio;

        @NotNull(message = "La duración en días es obligatoria")
        @Min(value = 1, message = "La duración debe ser al menos 1 día")
        private Integer duracionDias;

        @Builder.Default
        private Boolean activo = true;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ActualizarPlanRequest {
        private String nombre;
        private String descripcion;
        @DecimalMin(value = "0.01")
        private BigDecimal precio;
        @Min(value = 1)
        private Integer duracionDias;
        private Boolean activo;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PlanRespuesta {
        private Long id;
        private String nombre;
        private String descripcion;
        private BigDecimal precio;
        private Integer duracionDias;
        private Boolean activo;
        private LocalDateTime fechaCreacion;
        private LocalDateTime fechaActualizacion;
    }
}
