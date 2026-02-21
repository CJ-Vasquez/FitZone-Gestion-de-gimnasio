package com.fitzone.plan.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "plans")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Plan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String nombre;

    @Column(name = "description", length = 500)
    private String descripcion;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "duration_days", nullable = false)
    private Integer duracionDias;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @Column(name = "created_at") @Builder.Default
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime fechaActualizacion;

    @PreUpdate
    protected void onUpdate() { fechaActualizacion = LocalDateTime.now(); }
}
