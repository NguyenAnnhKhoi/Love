package com.lovegame.dto;

import com.lovegame.model.GameQuestion;

public record AnswerResponse(
        boolean correct,
        boolean completed,
        int currentQuestionIndex,
        int totalQuestions,
        String nextStage,
        String message,
        String explanation,
        GameQuestion question
) {
}
