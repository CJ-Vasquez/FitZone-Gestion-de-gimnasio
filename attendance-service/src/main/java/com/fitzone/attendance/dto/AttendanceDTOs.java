package com.fitzone.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

public class AttendanceDTOs {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CheckInRequest {
        @NotNull(message = "Member ID is required")
        private Long memberId;
        private String observation;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateAttendanceRequest {
        private LocalDateTime checkIn;
        private LocalDateTime checkOut;
        private String observation;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AttendanceResponse {
        private Long id;
        private Long memberId;
        private LocalDateTime checkIn;
        private LocalDateTime checkOut;
        private String observation;
        private Long minutesSpent;
    }
}
