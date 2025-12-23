/**
 * Modern Interactive Cursor Particle Trail
 *
 * Requirements:
 * - Particles following cursor with trail effect
 * - Soft glow, blur, and modern colors (Purple, Indigo, Cyan)
 * - Smooth fading and shrinking
 * - Disabled on mobile/touch
 * - Lightweight & 60fps
 */

(function () {
  // Configuration
  const CONFIG = {
    particleCount: 20, // Max particles to spawn per move event (throttle) or total active limit?
    // Actually efficient way: spawn 1-2 particles per frame/move
    spawnInterval: 5, // Spawn every X moves
    colors: [
      'rgba(99, 102, 241,', // Indigo-500
      'rgba(168, 85, 247,', // Purple-500
      'rgba(6, 182, 212,',  // Cyan-500
    ],
    size: { min: 4, max: 8 },
    lifeSpeed: 0.02, // Opacity fade speed
    shrinkSpeed: 0.1, // Size shrink speed
    blur: 4, // px
  };

  // State
  let width, height;
  let particles = [];
  let mouseX = -100;
  let mouseY = -100;
  let isMobile = false;

  // Mobile/Touch Detection
  function checkMobile() {
    isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.matchMedia('(hover: none)').matches;
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);

  if (isMobile) return; // Exit if mobile

  // Canvas Setup
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  // Resize Handler
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  // Particle Class
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * (CONFIG.size.max - CONFIG.size.min) + CONFIG.size.min;
      this.colorBase = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.opacity = 1;
      this.velocity = {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
      };
    }

    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.opacity -= CONFIG.lifeSpeed;
      this.size -= CONFIG.shrinkSpeed;
    }

    draw(ctx) {
      if (this.opacity <= 0 || this.size <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `${this.colorBase} ${this.opacity})`;
      ctx.shadowBlur = CONFIG.blur;
      ctx.shadowColor = `${this.colorBase} 0.5)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Filter dead particles
    particles = particles.filter((p) => p.opacity > 0 && p.size > 0);

    // Update and draw
    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });

    requestAnimationFrame(animate);
  }
  animate();

  // Mouse Move Handler
  let spawnCounter = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    spawnCounter++;
    if (spawnCounter >= 3) { // Limit spawn rate
        spawnCounter = 0;
        particles.push(new Particle(mouseX, mouseY));
    }
  });

})();
