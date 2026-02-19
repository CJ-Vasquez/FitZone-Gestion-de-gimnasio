package com.fitzone.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Attendance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "check_in", nullable = false)
    @Builder.Default
    private LocalDateTime checkIn = LocalDateTime.now();

    @Column(name = "check_out")
    private LocalDateTime checkOut;

    @Column(length = 255)
    private String observation;
}
