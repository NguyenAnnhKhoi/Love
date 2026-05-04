(function (window) {
  const LoveGame = window.LoveGame || (window.LoveGame = {});

  LoveGame.$ = (selector, root = document) => root.querySelector(selector);
  LoveGame.$$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  LoveGame.storage = {
    getGameId() {
      return localStorage.getItem('love_game_id') || '';
    },
    setGameId(gameId) {
      localStorage.setItem('love_game_id', gameId);
    },
    getPlayerName() {
      return localStorage.getItem('love_player_name') || '';
    },
    setPlayerName(playerName) {
      localStorage.setItem('love_player_name', playerName);
    },
    getResultChoice() {
      return localStorage.getItem('love_result_choice') || '';
    },
    setResultChoice(choice) {
      localStorage.setItem('love_result_choice', choice);
    }
  };


  LoveGame.view = {
    reveal(element, className = 'is-visible') {
      if (!element) return;
      element.classList.remove('is-hidden');
      element.classList.add(className);
    },
    hide(element) {
      if (!element) return;
      element.classList.add('is-hidden');
    },
    swapText(element, text) {
      if (!element) return;
      element.textContent = text;
    },
    setProgress(fillNode, value) {
      if (!fillNode) return;
      fillNode.style.width = `${Math.max(0, Math.min(100, value))}%`;
    }
  };

  LoveGame.resolveRoute = (path) => {
    if (!path) return 'index.html';
    const trimmed = String(path).trim();

    // Keep absolute URLs untouched.
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Root-relative paths from backend (e.g. /quiz.html) should behave as
    // same-folder routes for static frontend hosting under /frontend/*.
    if (trimmed.startsWith('/')) {
      return trimmed.slice(1);
    }

    return trimmed;
  };

  LoveGame.navigate = (url, delay = 180) => {
    const target = LoveGame.resolveRoute(url);
    document.body.classList.add('is-leaving');
    window.setTimeout(() => {
      window.location.href = target;
    }, delay);
  };

  LoveGame.pageName = () => document.body.dataset.page || '';
})(window);
