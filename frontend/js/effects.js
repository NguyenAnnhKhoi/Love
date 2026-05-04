(function (window) {
  const LoveGame = window.LoveGame;
  if (!LoveGame) return;

  let canvas;
  let context;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let particles = [];
  let animationFrame = 0;
  let audioContext;

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.className = 'confetti-layer';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    context = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function drawParticles() {
    if (!context) return;
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    particles = particles.filter((particle) => particle.life > 0);

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.rotation += particle.spin;
      particle.life -= 0.016;

      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(0, 0, particle.size, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    if (particles.length > 0) {
      animationFrame = window.requestAnimationFrame(drawParticles);
    } else {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      animationFrame = 0;
    }
  }

  function confettiBurst(options = {}) {
    ensureCanvas();
    const count = options.count || 70;
    const spread = options.spread || 80;
    const originX = options.x || canvasWidth / 2;
    const originY = options.y || canvasHeight / 4;
    const colors = options.colors || ['#ffb7c5', '#ffd56a', '#ffffff', '#6ef3b5'];

    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: originX + (Math.random() * spread - spread / 2),
        y: originY + (Math.random() * 24 - 12),
        vx: (Math.random() - 0.5) * 7,
        vy: -2 - Math.random() * 6,
        gravity: 0.08 + Math.random() * 0.1,
        size: 3 + Math.random() * 4,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
        life: 1.2 + Math.random() * 0.7,
        maxLife: 1.8,
        color: colors[index % colors.length]
      });
    }

    if (!animationFrame) {
      drawParticles();
    }
  }

  function unlockAudio() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function playTone(type = 'tap') {
    unlockAudio();
    if (!audioContext) return;

    const soundMap = {
      tap: [420],
      success: [523.25, 659.25, 783.99],
      error: [220, 196],
      soft: [349.23, 392]
    };

    const notes = soundMap[type] || soundMap.tap;
    const now = audioContext.currentTime;

    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = type === 'error' ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.08);

      gain.gain.setValueAtTime(0.0001, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, now + index * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.18);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now + index * 0.08);
      oscillator.stop(now + index * 0.08 + 0.2);
    });
  }

  function typewriter(element, text, options = {}) {
    if (!element) return Promise.resolve();
    const speed = options.speed || 18;
    const startDelay = options.startDelay || 0;

    return new Promise((resolve) => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        element.textContent = text;
        resolve();
        return;
      }

      let index = 0;
      element.textContent = '';

      window.setTimeout(function tick() {
        element.textContent += text[index] || '';
        index += 1;

        if (index < text.length) {
          window.setTimeout(tick, speed);
        } else {
          resolve();
        }
      }, startDelay);
    });
  }

  function shake(element) {
    if (!element) return;
    element.classList.remove('shake-soft');
    void element.offsetWidth;
    element.classList.add('shake-soft');
    window.setTimeout(() => {
      element.classList.remove('shake-soft');
    }, 520);
  }

  LoveGame.fx = {
    confettiBurst,
    playTone,
    typewriter,
    shake,
    unlockAudio
  };

  LoveGame.initFx = function () {
    ensureCanvas();
    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    window.requestAnimationFrame(() => document.body.classList.add('is-ready'));
  };
})(window);
