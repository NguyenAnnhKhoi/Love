(function (window) {
  const LoveGame = window.LoveGame;
  if (!LoveGame) return;

  let noClickCount = 0;

  function nudgeNoButton(button) {
    const offsets = [
      { x: 6, y: -4 },
      { x: -8, y: 6 },
      { x: 10, y: 2 },
      { x: -5, y: -6 }
    ];
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    button.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
  }

  function updateNoButtonText(button) {
    const texts = [
      'Thật luôn á? 😢',
      'Cho anh cơ hội đi mà 🥺',
      'Anh buồn đó nha 😭'
    ];
    if (noClickCount < texts.length) {
      button.textContent = texts[noClickCount];
    }
  }

  LoveGame.pages = LoveGame.pages || {};

  LoveGame.pages.confession = async function initConfessionPage() {
    const root = LoveGame.$('[data-confession-page]');
    if (!root) return;

    const gameId = LoveGame.storage.getGameId();
    if (!gameId) {
      LoveGame.navigate('index.html');
      return;
    }

    const rewardTitle = LoveGame.$('[data-reward-title]');
    const rewardText = LoveGame.$('[data-reward-text]');
    const letterTitle = LoveGame.$('[data-letter-title]');
    const letterBody = LoveGame.$('[data-letter-body]');
    const proposalTitle = LoveGame.$('[data-proposal-title]');
    const proposalGif = LoveGame.$('[data-proposal-gif]');
    const proposalButtons = LoveGame.$('[data-proposal-buttons]');
    const revealButton = LoveGame.$('[data-reveal-letter]');
    const yesButton = LoveGame.$('[data-yes-button]');
    const noButton = LoveGame.$('[data-no-button]');
    const letterPanel = LoveGame.$('[data-letter-panel]');

    try {
      const [reward, letter, proposal] = await Promise.all([
        LoveGame.game.reward(gameId),
        LoveGame.game.letter(gameId),
        LoveGame.game.proposal(gameId)
      ]);

      LoveGame.view.swapText(rewardTitle, reward.title);
      LoveGame.view.swapText(rewardText, reward.message);
      LoveGame.view.swapText(letterTitle, letter.title);
      LoveGame.view.swapText(letterBody, letter.body);
      LoveGame.view.swapText(proposalTitle, proposal.question);
      if (proposalGif) {
        const img = proposalGif.querySelector('img');
        if (img) {
          img.src = proposal.gifUrl || '';
          img.alt = 'GIF tỏ tình';
        }
      }
      LoveGame.view.hide(proposalButtons);

      revealButton.addEventListener('click', async () => {
        LoveGame.view.reveal(letterPanel, 'is-visible');
        LoveGame.fx.playTone('soft');
        LoveGame.fx.confettiBurst({ count: 16, spread: 70 });
        await LoveGame.fx.typewriter(letterBody, letter.body, { speed: 14 });
        LoveGame.view.reveal(proposalButtons, 'is-visible');
        revealButton.classList.add('is-hidden');
      });

      yesButton.addEventListener('click', async () => {
        LoveGame.storage.setResultChoice('YES');
        LoveGame.fx.playTone('success');
        LoveGame.fx.confettiBurst({ count: 110, spread: 160 });
        await LoveGame.game.submitResult(gameId, 'YES');
        LoveGame.navigate('success.html', 220);
      });

      noButton.addEventListener('pointerenter', () => nudgeNoButton(noButton));
      noButton.addEventListener('pointerdown', () => nudgeNoButton(noButton));
      noButton.addEventListener('click', async () => {
        noClickCount++;

        if (noClickCount < 4) {
          // Clicks 1-3: Evade + change text
          updateNoButtonText(noButton);
          nudgeNoButton(noButton);
          LoveGame.fx.playTone('tap');
        } else {
          // Click 4: Go to sad page
          LoveGame.storage.setResultChoice('NO');
          LoveGame.fx.playTone('error');
          LoveGame.fx.confettiBurst({ count: 20, spread: 60 });
          await LoveGame.game.submitResult(gameId, 'NO');
          LoveGame.navigate('sad.html', 220);
        }
      });
    } catch (error) {
      LoveGame.fx.playTone('error');
    }
  };
})(window);
