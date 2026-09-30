/**
 * Hero Scene — Landing page with Milky Way galaxy background.
 * Rendered in Canvas for maximum visual impact.
 */

import { Starfield, Nebula } from '../utils/starfield.js';

export class HeroScene {
  constructor(onStart) {
    this.onStart = onStart;
    this.engine = null;
    this.starfield = new Starfield(5, 400);
    this.nebula = new Nebula(8);
    this.fadeIn = 0;
    this.shipX = -100;
    this.shipAngle = 0;
    this.shootingStars = [];

    this._clickHandler = null;
    this._keyHandler = null;
  }

  init(engine) {
    this.engine = engine;
    this.fadeIn = 0;
    this.shipX = -100;

    this._clickHandler = (e) => {
      const w = this.engine.viewWidth;
      const h = this.engine.viewHeight;
      const titleY = h * 0.32;
      const cardY = titleY + 80;
      const btnY = cardY + 110;
      const btnH = 52;
      
      const btnCenterX = w / 2;
      const btnCenterY = btnY + btnH / 2;
      const btnW = Math.min(260, w * 0.35);

      if (Math.abs(e.clientX - btnCenterX) < btnW / 2 && Math.abs(e.clientY - btnCenterY) < btnH / 2) {
        this.onStart();
      }
    };
    window.addEventListener('click', this._clickHandler);

    this._keyHandler = (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        this.onStart();
      }
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  onResize() {}

  update(dt, time) {
    this.fadeIn = Math.min(1, this.fadeIn + dt * 0.6);

    // Animated spaceship flyover
    this.shipX += 80 * dt;
    if (this.shipX > this.engine.viewWidth + 200) {
      this.shipX = -200;
    }
    this.shipAngle = Math.sin(time * 0.5) * 0.1;

    // Shooting stars
    if (Math.random() < 0.02) {
      this.shootingStars.push({
        x: Math.random() * this.engine.viewWidth,
        y: Math.random() * this.engine.viewHeight * 0.5,
        vx: 300 + Math.random() * 200,
        vy: 100 + Math.random() * 100,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 0.5 + Math.random() * 0.5
      });
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= dt;
      if (s.life <= 0) this.shootingStars.splice(i, 1);
    }
  }

  render(ctx, time) {
    const w = this.engine.viewWidth;
    const h = this.engine.viewHeight;

    // Deep space background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    bgGrad.addColorStop(0, '#0F0A2A');
    bgGrad.addColorStop(0.4, '#0A061E');
    bgGrad.addColorStop(1, '#050510');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Starfield
    this.starfield.renderStatic(ctx, w, h, time);

    // Nebula clouds
    this.nebula.render(ctx, time * 10, time * 5, w, h, time);

    // Galaxy spiral effect (center)
    this._renderGalaxy(ctx, w, h, time);

    // Shooting stars
    for (const s of this.shootingStars) {
      const alpha = s.life / s.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 0.05, s.y - s.vy * 0.05);
      ctx.stroke();
      ctx.restore();
    }

    // Animated spaceship
    this._renderHeroShip(ctx, time);

    // Content overlay
    ctx.save();
    ctx.globalAlpha = this.fadeIn;

    // Title: MANTRA
    const titleY = h * 0.32;
    
    // Title glow
    ctx.save();
    ctx.shadowColor = '#00D4FF';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.min(72, w * 0.08)}px "Orbitron", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('MANTRA', w / 2, titleY);
    ctx.shadowBlur = 0;
    ctx.restore();

    // Gradient over title
    ctx.save();
    const titleGrad = ctx.createLinearGradient(w / 2 - 150, titleY - 30, w / 2 + 150, titleY + 10);
    titleGrad.addColorStop(0, '#00D4FF');
    titleGrad.addColorStop(0.5, '#FFFFFF');
    titleGrad.addColorStop(1, '#7B2FF7');
    ctx.fillStyle = titleGrad;
    ctx.font = `bold ${Math.min(72, w * 0.08)}px "Orbitron", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('MANTRA', w / 2, titleY);
    ctx.restore();

    // Subtitle
    ctx.fillStyle = '#FFFFFF99';
    ctx.font = `${Math.min(18, w * 0.025)}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Explore the Cosmos. Defend the Planets. Learn the Universe.', w / 2, titleY + 40);

    // Decorative line
    const lineW = Math.min(300, w * 0.4);
    const lineGrad = ctx.createLinearGradient(w / 2 - lineW / 2, 0, w / 2 + lineW / 2, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.3, '#00D4FF44');
    lineGrad.addColorStop(0.5, '#00D4FF');
    lineGrad.addColorStop(0.7, '#00D4FF44');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2 - lineW / 2, titleY + 55);
    ctx.lineTo(w / 2 + lineW / 2, titleY + 55);
    ctx.stroke();

    // Feature cards
    const cardY = titleY + 80;
    const cardW = Math.min(160, w * 0.2);
    const cardSpacing = Math.min(20, w * 0.02);
    const totalCardsW = cardW * 3 + cardSpacing * 2;
    const cardsStartX = (w - totalCardsW) / 2;

    const features = [
      { icon: '🚀', title: 'Explore', desc: 'Fly through the galaxy' },
      { icon: '🛡️', title: 'Defend', desc: 'Blast incoming meteoroids' },
      { icon: '📚', title: 'Learn', desc: 'Discover planet secrets' }
    ];

    for (let i = 0; i < features.length; i++) {
      const fx = cardsStartX + i * (cardW + cardSpacing);

      // Card background
      ctx.fillStyle = 'rgba(15, 15, 35, 0.6)';
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(fx, cardY, cardW, 80, 10);
      ctx.fill();
      ctx.stroke();

      // Icon
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(features[i].icon, fx + cardW / 2, cardY + 28);

      // Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "Orbitron", sans-serif';
      ctx.fillText(features[i].title, fx + cardW / 2, cardY + 50);

      // Description
      ctx.fillStyle = '#FFFFFF66';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText(features[i].desc, fx + cardW / 2, cardY + 66);
    }

    // Start button
    const btnY = cardY + 110;
    const pulse = Math.sin(time * 3) * 0.08 + 0.92;
    const btnW = Math.min(260, w * 0.35);
    const btnH = 52;
    const btnX = w / 2 - btnW / 2;

    // Button glow
    ctx.save();
    ctx.globalAlpha = this.fadeIn * 0.4 * pulse;
    const btnGlow = ctx.createRadialGradient(w / 2, btnY + btnH / 2, 0, w / 2, btnY + btnH / 2, btnW * 0.8);
    btnGlow.addColorStop(0, '#00D4FF44');
    btnGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = btnGlow;
    ctx.beginPath();
    ctx.arc(w / 2, btnY + btnH / 2, btnW * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Button background
    ctx.save();
    ctx.globalAlpha = this.fadeIn;
    const btnBgGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
    btnBgGrad.addColorStop(0, '#00D4FF');
    btnBgGrad.addColorStop(0.5, '#0088CC');
    btnBgGrad.addColorStop(1, '#7B2FF7');
    ctx.fillStyle = btnBgGrad;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 14);
    ctx.fill();

    // Button border glow
    ctx.strokeStyle = `rgba(0, 212, 255, ${0.5 * pulse})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Button text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.min(16, w * 0.022)}px "Orbitron", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚀  START LEARNING', w / 2, btnY + btnH / 2);
    ctx.restore();

    // Footer
    ctx.save();
    ctx.globalAlpha = this.fadeIn * 0.4;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Use Arrow Keys to navigate • Press Enter to begin', w / 2, h - 30);
    ctx.restore();

    ctx.restore();
  }

  _renderGalaxy(ctx, w, h, time) {
    ctx.save();
    ctx.translate(w / 2, h * 0.45);

    const maxArms = 4;
    const starsPerArm = 80;

    for (let arm = 0; arm < maxArms; arm++) {
      const baseAngle = (arm / maxArms) * Math.PI * 2 + time * 0.02;

      for (let i = 0; i < starsPerArm; i++) {
        const t = i / starsPerArm;
        const radius = t * Math.min(w, h) * 0.35;
        const spiralAngle = baseAngle + t * 2.5;

        const x = Math.cos(spiralAngle) * radius + (Math.random() - 0.5) * 20 * t;
        const y = Math.sin(spiralAngle) * radius * 0.35 + (Math.random() - 0.5) * 10 * t;

        const alpha = (1 - t) * 0.3 + 0.05;
        const size = (1 - t) * 1.5 + 0.5;

        ctx.globalAlpha = alpha;
        const colors = ['#FFFFFF', '#FFE4C4', '#ADD8E6', '#FFD700', '#E6E6FA'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Center glow
    ctx.globalAlpha = 0.3;
    const centerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
    centerGlow.addColorStop(0, '#FFF5CC');
    centerGlow.addColorStop(0.5, '#FDB81344');
    centerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = centerGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  _renderHeroShip(ctx, time) {
    const w = this.engine.viewWidth;
    const h = this.engine.viewHeight;
    const sy = h * 0.75 + Math.sin(time * 0.8) * 15;

    ctx.save();
    ctx.translate(this.shipX, sy);
    ctx.rotate(this.shipAngle - 0.05);
    ctx.scale(0.8, 0.8);

    // Engine trail
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 8; i++) {
      const trailX = -30 - i * 12;
      const alpha = (1 - i / 8) * 0.3;
      ctx.globalAlpha = alpha;
      const trailGrad = ctx.createRadialGradient(trailX, 0, 0, trailX, 0, 8 - i * 0.5);
      trailGrad.addColorStop(0, '#00D4FF');
      trailGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = trailGrad;
      ctx.beginPath();
      ctx.arc(trailX, (Math.random() - 0.5) * 4, 8 - i * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ship body
    ctx.globalAlpha = 0.7;
    const bodyGrad = ctx.createLinearGradient(-20, -10, 20, 10);
    bodyGrad.addColorStop(0, '#4A5568');
    bodyGrad.addColorStop(0.5, '#A0AEC0');
    bodyGrad.addColorStop(1, '#4A5568');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(25, 0);
    ctx.lineTo(10, -10);
    ctx.lineTo(-20, -7);
    ctx.lineTo(-23, 0);
    ctx.lineTo(-20, 7);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#00D4FF88';
    ctx.beginPath();
    ctx.ellipse(8, 0, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  cleanup() {
    if (this._clickHandler) window.removeEventListener('click', this._clickHandler);
    if (this._keyHandler) window.removeEventListener('keydown', this._keyHandler);
  }
}
