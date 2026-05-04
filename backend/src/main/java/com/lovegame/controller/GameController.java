package com.lovegame.controller;

import com.lovegame.dto.AnswerRequest;
import com.lovegame.dto.AnswerResponse;
import com.lovegame.dto.GameStateResponse;
import com.lovegame.dto.LetterResponse;
import com.lovegame.dto.ProposalChoiceRequest;
import com.lovegame.dto.ProposalResponse;
import com.lovegame.dto.RewardResponse;
import com.lovegame.dto.ResultResponse;
import com.lovegame.dto.StartGameRequest;
import com.lovegame.dto.StartGameResponse;
import com.lovegame.service.GameService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/start")
    public StartGameResponse start(@Valid @RequestBody StartGameRequest request) {
        return gameService.startGame(request.playerName());
    }

    @GetMapping("/state")
    public GameStateResponse state(@RequestParam String gameId) {
        return gameService.getState(gameId);
    }

    @PostMapping("/answer")
    public AnswerResponse answer(@Valid @RequestBody AnswerRequest request) {
        return gameService.submitAnswer(request.gameId(), request.answerIndex());
    }

    @GetMapping("/reward")
    public RewardResponse reward(@RequestParam String gameId) {
        return gameService.getReward(gameId);
    }

    @GetMapping("/letter")
    public LetterResponse letter(@RequestParam String gameId) {
        return gameService.getLetter(gameId);
    }

    @GetMapping("/proposal")
    public ProposalResponse proposal(@RequestParam String gameId) {
        return gameService.getProposal(gameId);
    }

    @PostMapping("/result")
    public ResultResponse result(@Valid @RequestBody ProposalChoiceRequest request) {
        return gameService.submitResult(request);
    }

    @GetMapping("/result")
    public ResultResponse resultState(@RequestParam String gameId) {
        return gameService.getResult(gameId);
    }
}
