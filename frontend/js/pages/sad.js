(function (window) {
  const LoveGame = window.LoveGame;
  if (!LoveGame) return;

  LoveGame.pages = LoveGame.pages || {};

  LoveGame.pages.sad = async function initSadPage() {
    const root = LoveGame.$('[data-sad-page]');
    if (!root) return;

    LoveGame.fx.playTone('error');
    LoveGame.fx.confettiBurst({ count: 20, spread: 60 });
  };
})(window);
