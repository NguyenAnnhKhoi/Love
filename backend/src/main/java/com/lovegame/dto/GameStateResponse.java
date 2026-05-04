package com.lovegame.dto;

import com.lovegame.model.GameQuestion;

public record GameStateResponse(
        String gameId,
        String playerName,
        String stage,
        int currentQuestionIndex,
        int totalQuestions,
        double progress,
        GameQuestion question,
        boolean completed
) {
}
