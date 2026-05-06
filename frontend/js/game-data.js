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
        body: `Cũng chẳng biết là từ bao giờ vào lúc nào mà việc mỗi ngày được nhắn tin trò chuyện đủ thứ trên đời đã trở thành một thói quen hằng ngày và đó lại là điều anh mong chờ nhất. Chắc là vào ngày ấy cái ngày mà anh được thấy những thứ thật nhất từ em, nó lại làm anh hẫng đi một nhịp " anh cũng không biết chuyện gì nữa, mà lúc ấy anh lại cố trấn an bản thân cơ "thế nó mới Hài", mà sau đó thì a lại muốn tiếp tục cơ lại muốn xa hơn bắt đầu tham lam hơn về thứ gọi là tình cảm, nhưng vẫn chưa bt sau khi ngày 1/1 mình lấy cái chủ đề hay câu chuyện để tiếp tục cơ 
"Trộm vía " là mình cũng xàm cũng tào laooo :))
Chắc đó lí do được trò chuyện với em tới h  

Em có thể không nhận ra nhưng anh cũng cũng cài cắm vào mấy cái liên quan đến cái GU bạn trai này, quan điểm về tình yêu này 
( liệt kê ra chắc cái web này chịu không nổi mất )

Còn khoảng thời gian ..... , thì cho anh xin lỗi nha 
lúc ấy chắc là bản nhân cách lo xa của anh nó chiếm hết tâm trí, giờ a vẫn khó mà chấp nhận bản thân khi đêm hôm ấy anh bắt đầu nói ra những thứ cấm cản mình rồi các kiểu, mà đêm ấy hụt hẫng thật sự không biết là anh có làm cho em buồn lây không ??
Cảm giác khá khùng, ngố, điên, khi anh làm điều ấy với e 

THÔI MÌNH ĐÀO NHẸ NHÀNG MÌNH BÙN MỘT CHÚT THÔI NHA

Trọn vẹn đọc tới đây thì mình cũng đã ngồi lại với nhau rồi ha

Anh không chắc mình sẽ là người hứa hay thề thốt gì cả nhưng anh vẫn muốn làm tất cả những gì trong khả năng để yêu em, có vẻ là hơi vội khi nói về tương lại nhưng thứ anh muốn là hiện tại là đơn giản chỉ là thằng BI có thể yêu có thể thương một người 

Anh làm cái trang web này không phải để gây ấn tượng hay là phô trương, chỉ là muốn nói với em một cách đặc biệt hơn một chút…

Rằng là:

Anh thương em...

Và nếu được, anh muốn không chỉ dừng lại ở việc "thích hay chỉ là yêu theo cảm xúc nhất thời" nữa mà hãy để anh được thương em, hãy để anh được yêu em theo cách của bản thân 

Em cho anh một cơ hội được ở bên em nha?`
      };
    },

    async proposal(gameId) {
      const state = loadState(gameId);
      if (!state) throw new Error('Không tìm thấy phiên chơi.');
      const name = state.playerName || 'bạn';
      return {
        name,
        question: 'Em cho phép anh được yêu em và làm người yêu của em nha?',
        gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2ZkaTN5NDFkdTA3NzBnM2c4MTgwYjRzeHFrZDRmZDJ6MXNoazFseSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/t8xgPfC5oNIRMrNooe/giphy.gif',
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
          ctaText: 'Hãy tạo những kỷ niệm đẹp hú hồn nha...'
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