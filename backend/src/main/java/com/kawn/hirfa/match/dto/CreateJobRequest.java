package com.kawn.hirfa.match.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateJobRequest(
        @NotBlank(message = "Title is required") @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters") String title,

        @NotBlank(message = "Description is required") @Size(max = 2000, message = "Description must be less than 2000 characters") String description,

        @NotNull(message = "Budget is required") @DecimalMin(value = "1.0", message = "Budget must be at least 1 TND") BigDecimal budget,

        @NotNull(message = "Latitude is required") @DecimalMin(value = "-90.0") @DecimalMax(value = "90.0") Double latitude,

        @NotNull(message = "Longitude is required") @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0") Double longitude) {
}
