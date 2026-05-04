package com.lovegame.dto;

import jakarta.validation.constraints.NotBlank;

public record ProposalChoiceRequest(
        @NotBlank String gameId,
        @NotBlank String choice
) {
}
