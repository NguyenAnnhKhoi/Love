package com.lovegame.dto;

import jakarta.validation.constraints.NotBlank;

public record StartGameRequest(@NotBlank String playerName) {
}
