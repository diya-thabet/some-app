package com.kawn.hirfa.chat.dto;

import jakarta.validation.constraints.*;

public record SendMessageRequest(
        @NotNull(message = "Sender ID is required") Long senderId,

        @NotNull(message = "Receiver ID is required") Long receiverId,

        @NotNull(message = "Job ID is required") Long jobId,

        @NotBlank(message = "Message content is required") @Size(max = 1000, message = "Message must be less than 1000 characters") String content) {
}
