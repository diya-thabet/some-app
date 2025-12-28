package com.kawn.hirfa.match.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record PlaceBidRequest(
        @NotNull(message = "Amount is required") @DecimalMin(value = "1.0", message = "Bid must be at least 1 TND") BigDecimal amount,

        @Size(max = 500, message = "Message must be less than 500 characters") String message) {
}
