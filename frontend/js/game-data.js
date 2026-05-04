(function (window) {
  const LoveGame = window.LoveGame || (window.LoveGame = {});

  const QUESTIONS = [
    { id: 1, title: 'Đầu tiên, bọn mình lần đầu nói chuyện với nhau về vấn đề gì?', options: ['Nhậu', 'Trêu chỉ vì 1 cái avatar', 'Rep cho có lệ :O', 'Noel năm ấy'], correct: 1, explanation: 'Đáp án đúng: Trêu chỉ vì 1 cái avatar.' },
    { id: 2, title: 'Ấn tượng đầu tiên khi em gặp anh là gì?', options: ['Đẹp trai, cao ráo, văn vở, NGẦU, LẠNH LÙNG như mùa ĐÔNG, siu COOL NGẦU , ÍT NÓI, PHA CHẾ SIU ĐỈNH, KHÓ GẦN, KHÓ Ở', 'Nói nhiều', 'Làm gì có ấn tượng đâu mà hỏi', 'Loi choi lóc chóc, nhoiiii'], correct: 0, explanation: 'Đáp án đúng: A (Ấn tượng: NGẦU NGẦU).' },
    { id: 3, title: 'Tớ làm cái game này vì lý do gì?', options: ['Chán nên làm chơi chơi thôi', 'Chuẩn bị cho kế hoạch', 'Rảnh', 'Phần thưởng cao quý :O'], correct: 3, explanation: 'Đáp án đúng: D (Phần thưởng cao quý).' },
    { id: 4, title: 'Vị của Mì Ramen ở quán như thế nào?', options: ['Bình thường', 'Xuất sắc', 'Eooooo Mặn kinh hồn', 'cũng cũng'], correct: 2, explanation: 'Đáp án đúng: C (Mặn kinh hồn).' },
    { id: 5, title: 'Câu hỏi cho ĐẠI KA KHÔI : "ELM có yêu tôi hayy ko"?', options: ['Có', 'YES', 'A', 'B'], correct: -1, explanation: 'Đáp án: ABCD đều đúng .' },
    { id: 6, title: 'Yêu hay không nó ở đây này! Ngày hôm ấy cùng vị trí này là ngày bao nhiêu?', options: ['23/4/2025', '24/3/2025', '23/4/2026', '24/3/2026'], correct: 2, explanation: 'Đáp án đúng: C (23/4/2026).' },
    { id: 7, title: 'Cảm nghĩ của em về Chân gà rút xương hôm nay?', options: ['Dở vãi chưởng luôn ý', 'Bình thường thôiiii', 'Xuất sắc 10 điểm không có nhưng xứng đáng có 1.0 người yêu', 'Khó nói'], correct: 2, explanation: 'Đáp án đúng: C (Xuất sắc).' },
    { id: 8, title: 'Anh có nên đi đọc sách lễ tiếp không?', options: ['KHÔNG', 'kó', 'làm thêm 1 lần quê nữa cho ngầu', 'B'], correct: 0, explanation: 'Đáp án đúng: A (KHÔNG).' },
    { id: 9, title: 'Chuyện gì mà buồn mà sầu thì mình bỏ qua cho nhau nha ( chuyện hồi tết cũng thế )', options: ['Chắc chắn rồi, chôn vùi nó đi', 'NO', 'Bỏ qua cho anh ngày hôm nay đó', 'Quên chuyện đó luôn'], correct: 2, explanation: 'Đáp án đúng: C (Bỏ qua cho anh ngày hôm nay đó).' },
    { id: 10, title: 'Trả lời được tới đây mà chật vật vậy sao? Nhưng ko sao bất ngờ cho em khi tốn thời gian cho cái web xàm này', options: ['Câu này đúng', 'Câu này sai', 'Câu này hơi hơi đúng', 'Câu này sai'], correct: 0, explanation: 'Đáp án đúng: A (Câu này đúng).' }
  ];

  function stateKey(gameId) {
    return `love_state_${gameId}`;
  }

  function createState(playerName) {
    return {
      gameId: `local-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      playerName: playerName || 'bạn',
      currentQuestionIndex: 0,
      answers: [],
      proposalChoice: '',
    };
  }

  function saveState(state) {
    localStorage.setItem(stateKey(state.gameId), JSON.stringify(state));
  }

  function loadState(gameId) {
    const raw = localStorage.getItem(stateKey(gameId));
    return raw ? JSON.parse(raw) : null;
  }

  function questionAt(index) {
    const question = QUESTIONS[index];
    if (!question) return null;
    return {
      id: question.id,
      title: question.title,
      options: question.options.slice(),
      explanation: question.explanation
    };
  }

  function buildStateResponse(state) {
    const completed = state.currentQuestionIndex >= QUESTIONS.length;
    return {
      gameId: state.gameId,
      playerName: state.playerName,
      stage: completed ? 'REWARD' : (state.currentQuestionIndex === 0 ? 'INTRO' : 'QUESTION'),
      currentQuestionIndex: state.currentQuestionIndex,
      totalQuestions: QUESTIONS.length,
      progress: Math.min(100, (state.currentQuestionIndex * 100) / QUESTIONS.length),
      question: completed ? null : questionAt(state.currentQuestionIndex),
      completed
    };
  }

  LoveGame.game = {
    QUESTIONS,

    async startGame(playerName) {
      const state = createState(playerName?.trim());
      saveState(state);
      LoveGame.storage.setGameId(state.gameId);
      LoveGame.storage.setPlayerName(state.playerName);
      return {
        gameId: state.gameId,
        playerName: state.playerName,
        message: `Bắt đầu hành trình dành riêng cho ${state.playerName}.`,
        redirectUrl: 'quiz.html'
      };
    },

    async getState(gameId) {
      const state = loadState(gameId);
      if (!state) throw new Error('Không tìm thấy phiên chơi.');
      return buildStateResponse(state);
    },

    async answer(gameId, answerIndex) {
      const state = loadState(gameId);
      if (!state) throw new Error('Không tìm thấy phiên chơi.');

      const question = QUESTIONS[state.currentQuestionIndex];
      if (!question) {
        return { correct: true, completed: true, currentQuestionIndex: QUESTIONS.length, totalQuestions: QUESTIONS.length, nextStage: 'REWARD', message: 'Bạn đã hoàn thành toàn bộ hành trình.', explanation: '', question: null };
      }

      const correct = question.correct < 0 || question.correct === answerIndex;
      state.answers.push(answerIndex);
      if (correct) {
        state.currentQuestionIndex += 1;
      }
      saveState(state);

      const completed = state.currentQuestionIndex >= QUESTIONS.length;
      return {
        correct,
        completed,
        currentQuestionIndex: state.currentQuestionIndex,
        totalQuestions: QUESTIONS.length,
        nextStage: completed ? 'REWARD' : 'QUESTION',
        message: correct ? `Chính xác. ${question.explanation}` : 'Chưa đúng, nhưng không sao. Mình thử lại nhẹ nhàng nhé.',
        explanation: question.explanation,
        question: completed ? null : questionAt(state.currentQuestionIndex)
      };
    },

    async reward(gameId) {
      const state = loadState(gameId);
      if (!state) throw new Error('Không tìm thấy phiên chơi.');
      const name = state.playerName || 'bạn';
      return {
        name,
        title: `Phần thưởng dành cho ${name}`,
        message: 'Bạn đã vượt qua 10 câu hỏi rất đẹp.',
        hint: 'Mở khóa một tâm thư được viết riêng cho bạn.'
      };
    },

    async letter(gameId) {
      const state = loadState(gameId);
      if (!state) throw new Error('Không tìm thấy phiên chơi.');
      const name = state.playerName || 'bạn';
      return {
        name,
        title: 'Tâm thư',
        body: `${name},\n\nKhông biết từ khi nào, việc mỗi ngày được nói chuyện với em đã trở thành điều mà anh mong chờ nhất. Có những lúc chỉ là vài câu hỏi thăm đơn giản thôi, nhưng với anh lại là cả một ngày vui.\n\nEm có thể không nhận ra, nhưng anh đã để ý em từ rất lâu rồi. Từ cách em cười, cách em nói chuyện, đến những lúc em vô tình dễ thương mà chính em cũng không biết.\n\nAnh không dám chắc mình là người hoàn hảo, cũng không dám hứa những điều quá xa xôi… nhưng anh chắc một điều là: anh sẽ luôn cố gắng để làm em vui, ở bên em khi em cần, và không để em phải một mình.\n\nAnh làm cái trang web này không phải để gây ấn tượng gì lớn lao, chỉ là muốn nói với em một cách đặc biệt hơn một chút…\n\nRằng là:\n\nAnh thương em.\n\nVà nếu được, anh muốn không chỉ dừng lại ở việc \"thương\" như bây giờ nữa…\n\nEm cho anh một cơ hội được ở bên em nha?`
      };
    },

    async proposal(gameId) {
      const state = loadState(gameId);
      if (!state) throw new Error('Không tìm thấy phiên chơi.');
      const name = state.playerName || 'bạn';
      return {
        name,
        question: 'Em cho phép anh được yêu em và làm boyfriend không? (không phải fake nhaaa 😭)',
        yesText: 'YES 💖',
        noText: 'NO 😡'
      };
    },

    async submitResult(gameId, choice) {
      const state = loadState(gameId);
      if (!state) throw new Error('Không tìm thấy phiên chơi.');
      state.proposalChoice = String(choice || '').trim().toUpperCase();
      saveState(state);
      if (state.proposalChoice === 'YES') {
        return {
          gameId: state.gameId,
          choice: 'YES',
          title: 'Chúc mừng! Em đã chính thức có người yêu là anh 😎❤️',
          message: 'Anh rất vui vì em nói có.',
          ctaText: 'Hãy tạo those đẹp lắm nha...'
        };
      }
      return {
        gameId: state.gameId,
        choice: 'NO',
        title: 'Anh hiểu rồi… 😞',
        message: 'Cảm ơn em đã đọc hết hành trình này.',
        ctaText: 'Dù thế nào, anh vẫn mong em luôn vui.'
      };
    },

    async result(gameId) {
      const state = loadState(gameId);
      if (!state) throw new Error('Không tìm thấy phiên chơi.');
      if (!state.proposalChoice) {
        return { gameId: state.gameId, choice: '', title: 'Chưa có kết quả', message: 'Hãy quay lại màn hình lựa chọn nhé.', ctaText: 'Tiếp tục' };
      }
      return this.submitResult(gameId, state.proposalChoice);
    }
  };
})(window);