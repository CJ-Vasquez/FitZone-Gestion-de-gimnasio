package com.fitzone.payment.dto;

import com.fitzone.payment.entity.Payment;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDTOs {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreatePaymentRequest {
        @NotNull(message = "Member ID is required")
        private Long memberId;

        @NotNull(message = "Plan ID is required")
        private Long planId;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01")
        private BigDecimal amount;

        @NotNull(message = "Payment method is required")
        private Payment.PaymentMethod paymentMethod;

        private String notes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdatePaymentRequest {
        private Payment.PaymentStatus status;
        private Payment.PaymentMethod paymentMethod;
        private String notes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PaymentResponse {
        private Long id;
        private Long memberId;
        private Long planId;
        private BigDecimal amount;
        private String paymentMethod;
        private String status;
        private LocalDateTime paymentDate;
        private String notes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PaymentEvent {
        private Long memberId;
        private Long planId;
        private String eventType;
    }
}
