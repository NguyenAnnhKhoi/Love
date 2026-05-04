package com.lovegame.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.lovegame.dto.AnswerResponse;
import com.lovegame.dto.GameStateResponse;
import com.lovegame.dto.LetterResponse;
import com.lovegame.dto.ProposalChoiceRequest;
import com.lovegame.dto.ProposalResponse;
import com.lovegame.dto.ResultResponse;
import com.lovegame.dto.RewardResponse;
import com.lovegame.dto.StartGameResponse;
import com.lovegame.model.GameQuestion;
import com.lovegame.model.GameState;

@Service
public class GameService {

    private static final int TOTAL_QUESTIONS = 10;

    private final Map<String, GameState> states = new ConcurrentHashMap<>();
    private final List<GameQuestion> questions = createQuestions();

    public StartGameResponse startGame(String playerName) {
        String cleanName = playerName == null ? "" : playerName.trim();
        String gameId = UUID.randomUUID().toString();
        states.put(gameId, new GameState(gameId, cleanName));
        return new StartGameResponse(gameId, cleanName, "Bắt đầu hành trình dành riêng cho " + cleanName + ".", "quiz.html");
    }

    public GameStateResponse getState(String gameId) {
        GameState state = getRequiredState(gameId);
        return new GameStateResponse(
                state.getGameId(),
                state.getPlayerName(),
                resolveStage(state),
                state.getCurrentQuestionIndex(),
                TOTAL_QUESTIONS,
                Math.min(100.0, (state.getCurrentQuestionIndex() * 100.0) / TOTAL_QUESTIONS),
                currentQuestionOrNull(state),
                state.isCompleted(TOTAL_QUESTIONS)
        );
    }

    public AnswerResponse submitAnswer(String gameId, int answerIndex) {
        GameState state = getRequiredState(gameId);
        if (state.isCompleted(TOTAL_QUESTIONS)) {
            return buildCompletedAnswerResponse(state);
        }

        GameQuestion question = questions.get(state.getCurrentQuestionIndex());
        int correctIdx = question.correctAnswerIndex();
        boolean correct = (correctIdx < 0) || (correctIdx == answerIndex);
        state.addAnswer(answerIndex);

        if (correct) {
            state.setCurrentQuestionIndex(state.getCurrentQuestionIndex() + 1);
        }

        boolean completed = state.isCompleted(TOTAL_QUESTIONS);
        String nextStage = completed ? "REWARD" : "QUESTION";
        String message = correct
                ? "Chính xác. " + question.explanation()
                : "Chưa đúng, nhưng không sao. Mình thử lại nhẹ nhàng nhé.";

        return new AnswerResponse(
                correct,
                completed,
                state.getCurrentQuestionIndex(),
                TOTAL_QUESTIONS,
                nextStage,
                message,
                question.explanation(),
                completed ? null : questions.get(state.getCurrentQuestionIndex())
        );
    }

    public RewardResponse getReward(String gameId) {
        GameState state = getRequiredState(gameId);
        String name = safeName(state.getPlayerName());
        return new RewardResponse(
                name,
                "Phần thưởng dành cho " + name,
                "Bạn đã vượt qua 10 câu hỏi rất đẹp.",
                "Mở khóa một tâm thư được viết riêng cho bạn."
        );
    }

    public LetterResponse getLetter(String gameId) {
        GameState state = getRequiredState(gameId);
        String name = safeName(state.getPlayerName());
        String body = """
                %s,

                Không biết từ khi nào, việc mỗi ngày được nói chuyện với em đã trở thành điều mà anh mong chờ nhất. Có những lúc chỉ là vài câu hỏi thăm đơn giản thôi, nhưng với anh lại là cả một ngày vui.

                Em có thể không nhận ra, nhưng anh đã để ý em từ rất lâu rồi. Từ cách em cười, cách em nói chuyện, đến những lúc em vô tình dễ thương mà chính em cũng không biết.

                Anh không dám chắc mình là người hoàn hảo, cũng không dám hứa những điều quá xa xôi… nhưng anh chắc một điều là: anh sẽ luôn cố gắng để làm em vui, ở bên em khi em cần, và không để em phải một mình.

                Anh làm cái trang web này không phải để gây ấn tượng gì lớn lao, chỉ là muốn nói với em một cách đặc biệt hơn một chút…

                Rằng là:

                Anh thương em.

                Và nếu được, anh muốn không chỉ dừng lại ở việc "thương" như bây giờ nữa…

                Em cho anh một cơ hội được ở bên em nha?
                """.formatted(name);

        return new LetterResponse(name, "Tâm thư", body);
    }

    public ProposalResponse getProposal(String gameId) {
        GameState state = getRequiredState(gameId);
        String name = safeName(state.getPlayerName());
        return new ProposalResponse(
                name,
                "Em cho phép anh được yêu em và làm boyfriend không? (không phải fake nhaaa 😭)",
                "YES 💖",
                "NO 😡"
        );
    }

    public ResultResponse submitResult(ProposalChoiceRequest request) {
        GameState state = getRequiredState(request.gameId());
        String choice = request.choice().trim().toUpperCase(Locale.ROOT);
        state.setProposalChoice(choice);

        if ("YES".equals(choice)) {
            return new ResultResponse(
                    state.getGameId(),
                    "YES",
                    "Chúc mừng! Em đã chính thức có người yêu là anh 😎❤️",
                    "Anh rất vui vì em nói có.",
                    "Hãy tạo those đẹp lắm nha..."
            );
        }

        return new ResultResponse(
                state.getGameId(),
                "NO",
                "Anh hiểu rồi… 😞",
                "Cảm ơn em đã đọc hết hành trình này.",
                "Dù thế nào, anh vẫn mong em luôn vui."
        );
    }

    public ResultResponse getResult(String gameId) {
        GameState state = getRequiredState(gameId);
        String choice = state.getProposalChoice();
        if (choice == null) {
            return new ResultResponse(state.getGameId(), "", "Chưa có kết quả", "Hãy quay lại màn hình lựa chọn nhé.", "Tiếp tục");
        }

        return submitResult(new ProposalChoiceRequest(gameId, choice));
    }

    private GameState getRequiredState(String gameId) {
        GameState state = states.get(gameId);
        if (state == null) {
            throw new IllegalArgumentException("Không tìm thấy phiên chơi.");
        }
        return state;
    }

    private GameQuestion currentQuestionOrNull(GameState state) {
        if (state.isCompleted(TOTAL_QUESTIONS)) {
            return null;
        }
        return questions.get(state.getCurrentQuestionIndex());
    }

    private String resolveStage(GameState state) {
        if (state.isCompleted(TOTAL_QUESTIONS)) {
            return "REWARD";
        }
        return state.getCurrentQuestionIndex() == 0 ? "INTRO" : "QUESTION";
    }

    private AnswerResponse buildCompletedAnswerResponse(GameState state) {
        return new AnswerResponse(true, true, TOTAL_QUESTIONS, TOTAL_QUESTIONS, "REWARD", "Bạn đã hoàn thành toàn bộ hành trình.", "", null);
    }

    private String safeName(String name) {
        return name == null || name.isBlank() ? "bạn" : name;
    }

    private List<GameQuestion> createQuestions() {
        List<GameQuestion> result = new ArrayList<>();
        result.add(new GameQuestion(1, "Đầu tiên, bọn mình lần đầu nói chuyện với nhau về vấn đề gì?",
            List.of("Nhậu", "Trêu chỉ vì 1 cái avatar", "Rep cho có lệ :O", "Noel năm ấy"),
            1, "Đáp án đúng: Trêu chỉ vì 1 cái avatar."));

        result.add(new GameQuestion(2, "Ấn tượng đầu tiên khi em gặp anh là gì?",
            List.of(
                "Đẹp trai, cao ráo, văn vở, NGẦU, LẠNH LÙNG như mùa ĐÔNG, siu COOL NGẦU , ÍT NÓI, PHA CHẾ SIU ĐỈNH, KHÓ GẦN, KHÓ Ở",
                "Nói nhiều",
                "Làm gì có ấn tượng đâu mà hỏi",
                "Loi choi lóc chóc, nhoiiii"
            ),
            0, "Đáp án đúng: A (Ấn tượng: NGẦU NGẦU)."));

        result.add(new GameQuestion(3, "Tớ làm cái game này vì lý do gì?",
            List.of("Chán nên làm chơi chơi thôi", "Chuẩn bị cho kế hoạch", "Rảnh", "Phần thưởng cao quý :O"),
            3, "Đáp án đúng: D (Phần thưởng cao quý)."));

        result.add(new GameQuestion(4, "Vị của Mì Ramen ở quán như thế nào?",
            List.of("Bình thường", "Xuất sắc", "Eooooo Mặn kinh hồn", "cũng cũng"),
            2, "Đáp án đúng: C (Mặn kinh hồn)."));

        result.add(new GameQuestion(5, "Câu hỏi cho ĐẠI KA KHÔI : \"ELM có yêu tôi hayy ko\"?",
            List.of("Có", "YES", "A", "B"),
            -1, "Đáp án: ABCD đều đúng ."));

        result.add(new GameQuestion(6, "Yêu hay không nó ở đây này! Ngày hôm ấy cùng vị trí này là ngày bao nhiêu?",
            List.of("23/4/2025", "24/3/2025", "23/4/2026", "24/3/2026"),
            2, "Đáp án đúng: C (23/4/2026)."));

        result.add(new GameQuestion(7, "Cảm nghĩ của em về Chân gà rút xương hôm nay?",
            List.of("Dở vãi chưởng luôn ý", "Bình thường thôiiii", "Xuất sắc 10 điểm không có nhưng xứng đáng có 1.0 người yêu", "Khó nói"),
            2, "Đáp án đúng: C (Xuất sắc)."));

        result.add(new GameQuestion(8, "Anh có nên đi đọc sách lễ tiếp không?",
            List.of("KHÔNG", "kó", "làm thêm 1 lần quê nữa cho ngầu", "B"),
            0, "Đáp án đúng: A (KHÔNG)."));

        result.add(new GameQuestion(9, "Chuyện gì mà buồn mà sầu thì mình bỏ qua cho nhau nha ( chuyện hồi tết cũng thế )",
            List.of("Chắc chắn rồi, chôn vùi nó đi", "NO", "Bỏ qua cho anh ngày hôm nay đó", "Quên chuyện đó luôn"),
            2, "Đáp án đúng: C (Bỏ qua cho anh ngày hôm nay đó)."));

        result.add(new GameQuestion(10, "Trả lời được tới đây mà chật vật vậy sao? Nhưng ko sao bất ngờ cho em khi tốn thời gian cho cái web xàm này",
            List.of("Câu này đúng", "Câu này sai", "Câu này hơi hơi đúng", "Câu này sai"),
            0, "Đáp án đúng: A (Câu này đúng)."));
        return List.copyOf(result);
    }
}
