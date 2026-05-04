package com.lovegame.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AnswerRequest(
        @NotBlank String gameId,
        @NotNull Integer answerIndex
) {
}
