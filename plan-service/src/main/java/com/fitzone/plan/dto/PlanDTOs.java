package com.fitzone.plan.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PlanDTOs {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreatePlanRequest {
        @NotBlank(message = "Plan name is required")
        @Size(max = 100)
        private String name;

        @Size(max = 500)
        private String description;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be positive")
        private BigDecimal price;

        @NotNull(message = "Duration in days is required")
        @Min(value = 1, message = "Duration must be at least 1 day")
        private Integer durationDays;

        @Builder.Default
        private Boolean active = true;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdatePlanRequest {
        private String name;
        private String description;
        @DecimalMin(value = "0.01")
        private BigDecimal price;
        @Min(value = 1)
        private Integer durationDays;
        private Boolean active;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PlanResponse {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer durationDays;
        private Boolean active;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
