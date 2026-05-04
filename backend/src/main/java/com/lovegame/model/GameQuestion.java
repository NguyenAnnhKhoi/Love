package com.lovegame.model;

import java.util.List;

public record GameQuestion(
        int id,
        String title,
        List<String> options,
        int correctAnswerIndex,
        String explanation
) {
}
