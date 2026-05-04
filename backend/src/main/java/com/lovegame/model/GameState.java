package com.lovegame.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class GameState {
    private final String gameId;
    private final String playerName;
    private final Instant startedAt;
    private final List<Integer> selectedAnswers = new ArrayList<>();
    private int currentQuestionIndex;
    private String proposalChoice;

    public GameState(String gameId, String playerName) {
        this.gameId = gameId;
        this.playerName = playerName;
        this.startedAt = Instant.now();
    }

    public String getGameId() {
        return gameId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public List<Integer> getSelectedAnswers() {
        return selectedAnswers;
    }

    public int getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public void setCurrentQuestionIndex(int currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
    }

    public String getProposalChoice() {
        return proposalChoice;
    }

    public void setProposalChoice(String proposalChoice) {
        this.proposalChoice = proposalChoice;
    }

    public void addAnswer(int answerIndex) {
        selectedAnswers.add(answerIndex);
    }

    public boolean isCompleted(int totalQuestions) {
        return currentQuestionIndex >= totalQuestions;
    }
}
