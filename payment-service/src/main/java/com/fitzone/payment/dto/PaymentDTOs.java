package com.fitzone.payment.dto;

import com.fitzone.payment.entity.Payment;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDTOs {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CrearPagoRequest {
        @NotNull(message = "El ID del miembro es obligatorio")
        private Long miembroId;

        @NotNull(message = "El ID del plan es obligatorio")
        private Long planId;

        @NotNull(message = "El monto es obligatorio")
        @DecimalMin(value = "0.01")
        private BigDecimal monto;

        @NotNull(message = "El método de pago es obligatorio")
        private Payment.MetodoPago metodoPago;

        private String notas;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ActualizarPagoRequest {
        private Payment.EstadoPago estado;
        private Payment.MetodoPago metodoPago;
        private String notas;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PagoRespuesta {
        private Long id;
        private Long miembroId;
        private Long planId;
        private BigDecimal monto;
        private String metodoPago;
        private String estado;
        private LocalDateTime fechaPago;
        private String notas;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class EventoPago {
        private Long miembroId;
        private Long planId;
        private String tipoEvento;
    }
}
