package com.fitzone.payment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long miembroId;

    @Column(name = "plan_id", nullable = false)
    private Long planId;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private MetodoPago metodoPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private EstadoPago estado = EstadoPago.PENDIENTE;

    @Column(name = "payment_date")
    @Builder.Default
    private LocalDateTime fechaPago = LocalDateTime.now();

    @Column(name = "notes", length = 255)
    private String notas;

    public enum MetodoPago {
        EFECTIVO, TARJETA, TRANSFERENCIA, YAPE, PLIN
    }

    public enum EstadoPago {
        PENDIENTE, CONFIRMADO, CANCELADO
    }
}
