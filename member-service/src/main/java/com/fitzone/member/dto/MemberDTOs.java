package com.fitzone.member.dto;

import com.fitzone.member.entity.Member;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public class MemberDTOs {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateMemberRequest {
        @NotBlank(message = "First name is required")
        @Size(max = 100)
        private String firstName;

        @NotBlank(message = "Last name is required")
        @Size(max = 100)
        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email")
        private String email;

        @Size(max = 15)
        private String phone;

        @NotBlank(message = "DNI is required")
        @Size(min = 8, max = 8, message = "DNI must be 8 characters")
        private String dni;

        private Long planId;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateMemberRequest {
        @Size(max = 100)
        private String firstName;

        @Size(max = 100)
        private String lastName;

        @Email
        private String email;

        @Size(max = 15)
        private String phone;

        private Member.Status status;
        private Long planId;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MemberResponse {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String dni;
        private String status;
        private Long planId;
        private LocalDateTime registeredAt;
        private LocalDateTime updatedAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PaymentEvent {
        private Long memberId;
        private Long planId;
        private String eventType;
    }
}
