(function (window) {
  const LoveGame = window.LoveGame;
  if (!LoveGame) return;

  function formatQuestion(question) {
    if (!question) return '';
    return `Câu ${question.id}: ${question.title}`;
  }

  const questionGifs = {
    1: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2ZkaTN5NDFkdTA3NzBnM2c4MTgwYjRzeHFrZDRmZDJ6MXNoazFseSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/t8xgPfC5oNIRMrNooe/giphy.gif',
    2: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHJqeWVseXp3OXNrNTRtNDUwZzBiaXd4MGh0azh6aDc3YmxhOXRwaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xoHntNXFYkfzGAftEv/giphy.gif',
    3: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWNmZGxtY2lwZHhiMm9xdWlvY253dXFkbHZiOHRvemprN2EybGh5aCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/W1hd3uXRIbddu/giphy.gif',
    4: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2F6d2o1aWQ1OXlyYTNqOXQ5OHE1Z2hieHd5aDB0cWllNTU3ejdjaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9JcMdbuGdV32fkswuR/giphy.gif',
    5: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamp1bTZubzdoNndjdXZ1cTJ5emw3OHZvZGYxMTB0aXV5Y2Y2aGpibSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/R6gvnAxj2ISzJdbA63/giphy.gif',
    6: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3M2dkeTlpbTBlYnYwdGlqeGx1OHMyNmdjZnZzcXV0dHU1MHl3b3M0OSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26FLdmIp6wJr91JAI/giphy.gif',
    7: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2ZveHpmczBmeDQ2dmE0Z2FhdzgzdW5xd21qaWhyM3R6bnRzNGtkZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/D4DVZGkq7spI2Fewg3/giphy.gif',
    8: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGdpYXhvM2x2ZTVnbDIzcng5d2ZiMnIyamN4cjg2emt0bG1sbzJudiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nR4L10XlJcSeQ/giphy.gif',
    9: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmQ2bHBuNnk2eWFhbG9iZXgxaTRhYXVvazl2OXZnN3oya2RsMjQ0ayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nNZNdwBcX0m6zJ6HTr/giphy.gif',
    10: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDUzbHJtN3ZhMXB2ZmV2djZzb2thNTJsdXllamMycjd1bjR4dHQxdSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4xpB3eE00FfBm/giphy.gif'
  };

  function renderQuestion(question, currentQuestionIndex = 0, totalQuestions = 10) {
    const questionTitle = LoveGame.$('[data-question-title]');
    const questionIndex = LoveGame.$('[data-question-index]');
    const progressFill = LoveGame.$('[data-progress-fill]');
    const answersWrap = LoveGame.$('[data-answers]');
    const questionCard = LoveGame.$('[data-question-card]');
    const introCard = LoveGame.$('[data-intro-card]');
    const feedback = LoveGame.$('[data-question-feedback]');
  const gifContainer = LoveGame.$('[data-question-gif]');

    if (!question || !answersWrap) return;

    LoveGame.view.hide(introCard);
    LoveGame.view.reveal(questionCard, 'is-visible');
    LoveGame.view.swapText(questionTitle, formatQuestion(question));
    LoveGame.view.swapText(questionIndex, `${Math.min(currentQuestionIndex + 1, totalQuestions)} / ${totalQuestions}`);
    LoveGame.view.setProgress(progressFill, (currentQuestionIndex * 100) / totalQuestions);

    if (gifContainer) {
      const img = gifContainer.querySelector('img');
      if (img) {
        img.src = questionGifs[question.id] || questionGifs[Object.keys(questionGifs)[Math.floor(Math.random() * Object.keys(questionGifs).length)]];
      }
    }

    if (feedback) {
      feedback.textContent = '';
      feedback.classList.add('is-hidden');
    }

    answersWrap.innerHTML = '';

    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-btn w-full text-left enter-up';
      button.style.animationDelay = `${index * 60}ms`;
      button.textContent = option;
      button.addEventListener('click', () => handleAnswer(question, index, button));
      answersWrap.appendChild(button);
    });
  }

  async function handleAnswer(question, answerIndex, button) {
    const gameId = LoveGame.storage.getGameId();
    const feedback = LoveGame.$('[data-question-feedback]');
    const answerButtons = LoveGame.$$('[data-answer-button], .answer-btn');

    answerButtons.forEach((item) => {
      item.disabled = true;
    });

    try {
      const response = await LoveGame.api.answer(gameId, answerIndex);
      const pickedButton = button;

      if (pickedButton) {
        pickedButton.classList.add(response.correct ? 'correct' : 'incorrect');
      }

      if (feedback) {
        feedback.textContent = response.message || '';
        feedback.classList.remove('is-hidden');
      }

      if (response.correct) {
        LoveGame.fx.playTone('success');
        LoveGame.fx.confettiBurst({ count: 32, spread: 100 });
      } else {
        LoveGame.fx.playTone('soft');
        LoveGame.fx.shake(button);
      }

      if (response.completed) {
        window.setTimeout(() => {
          LoveGame.navigate('/confession.html', 120);
        }, 750);
        return;
      }

      window.setTimeout(() => {
        renderQuestion(response.question, response.currentQuestionIndex, response.totalQuestions);
        answerButtons.forEach((item) => {
          item.disabled = false;
          item.classList.remove('correct', 'incorrect');
        });
      }, response.correct ? 700 : 560);
    } catch (error) {
      if (feedback) {
        feedback.textContent = 'Có chút trục trặc nhỏ, mình thử lại nhé.';
        feedback.classList.remove('is-hidden');
      }
      answerButtons.forEach((item) => {
        item.disabled = false;
      });
      LoveGame.fx.playTone('error');
    }
  }

  LoveGame.pages = LoveGame.pages || {};

  LoveGame.pages.quiz = async function initQuizPage() {
    const root = LoveGame.$('[data-quiz-page]');
    if (!root) return;

    const gameId = LoveGame.storage.getGameId();
    if (!gameId) {
      LoveGame.navigate('/index.html');
      return;
    }

    const playerName = LoveGame.storage.getPlayerName();
    LoveGame.view.swapText(LoveGame.$('[data-player-name-display]'), playerName || 'bạn');

    const introButton = LoveGame.$('[data-begin-quiz]');
    const introCard = LoveGame.$('[data-intro-card]');
    const introHint = LoveGame.$('[data-intro-hint]');
    const questionCard = LoveGame.$('[data-question-card]');

    try {
      const state = await LoveGame.api.getState(gameId);

      LoveGame.view.hide(questionCard);

      introButton.addEventListener('click', () => {
        LoveGame.view.hide(introCard);
        LoveGame.view.hide(introHint);
        if (state.question) {
          renderQuestion(state.question, state.currentQuestionIndex, state.totalQuestions);
        }
      });

      if (state.stage === 'QUESTION' && state.question) {
        LoveGame.view.hide(introCard);
        renderQuestion(state.question, state.currentQuestionIndex, state.totalQuestions);
      }
    } catch (error) {
      if (introHint) {
        introHint.textContent = 'Không thể tải trạng thái game. Hãy kiểm tra backend đang chạy ở cổng 8080.';
      }
      LoveGame.fx.playTone('error');
    }
  };
})(window);
