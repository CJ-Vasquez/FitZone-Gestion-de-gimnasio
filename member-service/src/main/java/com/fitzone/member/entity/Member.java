package com.fitzone.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String nombre;

    @Column(name = "last_name", nullable = false, length = 100)
    private String apellido;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(name = "phone", length = 15)
    private String telefono;

    @Column(unique = true, nullable = false, length = 8)
    private String dni;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private Estado estado = Estado.PENDIENTE;

    @Column(name = "plan_id")
    private Long planId;

    @Column(name = "registered_at")
    @Builder.Default
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime fechaActualizacion;

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    public enum Estado {
        ACTIVO, INACTIVO, PENDIENTE
    }
}
