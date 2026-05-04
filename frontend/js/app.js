document.addEventListener('DOMContentLoaded', () => {
  if (!window.LoveGame) {
    return;
  }

  if (typeof window.LoveGame.initFx === 'function') {
    window.LoveGame.initFx();
  }

  const pageName = typeof window.LoveGame.pageName === 'function' ? window.LoveGame.pageName() : '';
  const pageInit = window.LoveGame.pages && window.LoveGame.pages[pageName];

  if (typeof pageInit === 'function') {
    Promise.resolve(pageInit()).catch((error) => {
      console.error('LoveGame page init failed:', error);
    });
  }
});
