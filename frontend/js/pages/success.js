(function (window) {
  const LoveGame = window.LoveGame;
  if (!LoveGame) return;

  LoveGame.pages = LoveGame.pages || {};

  LoveGame.pages.success = async function initSuccessPage() {
    const root = LoveGame.$('[data-success-page]');
    if (!root) return;

    const gameId = LoveGame.storage.getGameId();
    if (!gameId) {
      LoveGame.navigate('/index.html');
      return;
    }

    const choice = LoveGame.storage.getResultChoice();
    const result = await LoveGame.api.result(gameId);
    const finalChoice = choice || result.choice;

    LoveGame.view.swapText(LoveGame.$('[data-result-title]'), finalChoice === 'YES' ? 'Chúc mừng! Em đã chính thức có người yêu là anh 😎❤️' : 'Mình trân trọng câu trả lời của bạn');
    LoveGame.view.swapText(LoveGame.$('[data-result-message]'), finalChoice === 'YES'
      ? 'Gòi hun tui cái nhanh nênnnnnnnnn.'
      : 'Cảm ơn bạn đã đi hết hành trình này một cách rất dịu dàng.');
    LoveGame.view.swapText(LoveGame.$('[data-result-cta]'), result.ctaText || '');
    LoveGame.view.swapText(LoveGame.$('[data-result-mark]'), finalChoice === 'YES' ? '♥' : '✦');

    if (finalChoice === 'YES') {
      LoveGame.fx.playTone('success');
      LoveGame.fx.confettiBurst({ count: 130, spread: 180 });
    } else {
      LoveGame.fx.playTone('soft');
      LoveGame.fx.confettiBurst({ count: 20, spread: 60, colors: ['#ffffff', '#ffb7c5'] });
    }
  };
})(window);
