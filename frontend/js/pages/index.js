(function (window) {
  const LoveGame = window.LoveGame;
  if (!LoveGame) return;

  LoveGame.pages = LoveGame.pages || {};

  LoveGame.pages.index = async function initIndexPage() {
    const form = LoveGame.$('[data-start-form]');
    const input = LoveGame.$('[data-player-name]');
    const errorBox = LoveGame.$('[data-form-error]');
    if (!form || !input) return;

    const savedName = LoveGame.storage.getPlayerName();
    if (savedName) {
      input.value = savedName;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const playerName = input.value.trim();
      if (!playerName) {
        if (errorBox) {
          errorBox.textContent = 'Hãy nhập tên của bạn trước nhé.';
          errorBox.classList.remove('is-hidden');
        }
        LoveGame.fx.shake(form);
        LoveGame.fx.playTone('error');
        return;
      }

      LoveGame.storage.setPlayerName(playerName);
      if (errorBox) {
        errorBox.classList.add('is-hidden');
      }

      try {
        const payload = await LoveGame.api.startGame(playerName);
        LoveGame.storage.setGameId(payload.gameId);
        LoveGame.fx.playTone('success');
        LoveGame.fx.confettiBurst({ count: 24, spread: 120 });
        LoveGame.navigate(LoveGame.resolveRoute(payload.redirectUrl || '/quiz.html'), 220);
      } catch (error) {
        if (errorBox) {
          errorBox.textContent = 'Không kết nối được backend. Hãy kiểm tra cổng 8080 đang chạy.';
          errorBox.classList.remove('is-hidden');
        }
        LoveGame.fx.playTone('error');
        LoveGame.fx.shake(form);
      }
    });

    window.setTimeout(() => {
      const badge = LoveGame.$('[data-start-badge]');
      if (badge) {
        badge.classList.add('badge-pop');
      }
    }, 100);
  };
})(window);
